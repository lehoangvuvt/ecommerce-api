import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import AssignAttributeSetDTO from 'src/dtos/assign-attribute-set.dto'
import CategoryDetailsDTO from 'src/dtos/category-details.dto'
import CreateAttributeSetDTO from 'src/dtos/create-attribute-set.dto'
import CreateCategoryAttributeDTO from 'src/dtos/create-category-attribute.dto'
import CreateCategoryDTO from 'src/dtos/create-category.dto'
import AttributeSet from 'src/entities/attribute-set.entity'
import Brand from 'src/entities/brand.entity'
import CategoryBrand from 'src/entities/category-brand.entity'
import Category from 'src/entities/category.entity'
import { Repository } from 'typeorm'

export type CategoryWithChild = {
  child: CategoryWithChild[]
} & Category

export type AttributeWithValues = AttributeWithStringValues | AttributeWithNumberValues

export type AttributeWithStringValues = {
  attribute_name: string
  id: string
  value_type: 'string'
  values: string[]
}

export type AttributeWithNumberValues = {
  attribute_name: string
  id: string
  value_type: 'number'
  values: number[]
}

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    @InjectRepository(CategoryBrand) private categoryBrandRepository: Repository<CategoryBrand>,
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
    @InjectRepository(AttributeSet) private attributeSetRepository: Repository<AttributeSet>
  ) {}

  async getCategories(): Promise<CategoryWithChild[]> {
    const allCategories = await this.categoryRepository.find()
    let categories: CategoryWithChild[] = allCategories
      .filter((item) => item.parent_category_id === null)
      .map((item) => {
        return {
          ...item,
          child: [],
        } as CategoryWithChild
      })
    categories.forEach((item) => this.getChildCategories(item, allCategories))
    return categories
  }

  async getCategoryDetails(categoryId: string): Promise<CategoryDetailsDTO> {
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } })
    if (!category) return null
    const categoryDetails: CategoryDetailsDTO = {
      brands: [],
      category_name: category.category_name,
      parent_category_id: category.parent_category_id,
      groupedAttributeWithValues: [],
    }
    const categoryBrands = await this.categoryBrandRepository.find({ where: { category_id: categoryId } })
    if (categoryBrands.length > 0) {
      const getFoundBrandsDetails = categoryBrands.map(async (item) => {
        const brandDetails = await this.brandRepository.findOne({ where: { id: item.brand_id } })
        categoryDetails.brands.push(brandDetails)
      })
      await Promise.all(getFoundBrandsDetails)
    }
    if (category.attribute_set_id !== null) {
      const attributeSet = await this.attributeSetRepository.findOne({ where: { id: category.attribute_set_id } })
      if (attributeSet) {
        let groupedAttributeWithValues: AttributeWithValues[] = []
        attributeSet.attributeSetValueMappings.forEach((item) => {
          const { attributeValue } = item
          const { attribute, value_decimal, value_int, value_string } = attributeValue
          const { value_type, attribute_name, id: attributeId } = attribute
          let newAttributeWithValues: AttributeWithValues
          if (value_type === 2) {
            newAttributeWithValues = {
              attribute_name: attribute_name,
              id: attributeId,
              value_type: 'string',
              values: [value_string],
            }
          } else {
            newAttributeWithValues = {
              attribute_name: attribute_name,
              id: attributeId,
              value_type: 'number',
              values: value_type === 0 ? [value_decimal] : [value_int],
            }
          }
          if (groupedAttributeWithValues.length === 0) {
            groupedAttributeWithValues.push(newAttributeWithValues)
          } else {
            const foundIndex = groupedAttributeWithValues.findIndex((fItem) => fItem.attribute_name === attribute_name)
            if (foundIndex === -1) {
              groupedAttributeWithValues.push(newAttributeWithValues)
            } else {
              const existedAttributeWithValues = groupedAttributeWithValues[foundIndex]
              if (existedAttributeWithValues.value_type === 'string') {
                existedAttributeWithValues.values.push(value_string)
              } else {
                if (value_type === 0) {
                  existedAttributeWithValues.values.push(value_decimal)
                } else {
                  existedAttributeWithValues.values.push(value_int)
                }
              }
              groupedAttributeWithValues[foundIndex] = existedAttributeWithValues
            }
          }
        })
        categoryDetails.groupedAttributeWithValues = groupedAttributeWithValues
      }
    }
    return categoryDetails
  }

  getChildCategories(categoryWithChild: CategoryWithChild, allCategories: Category[]) {
    const childs: CategoryWithChild[] = allCategories
      .filter((item) => item.parent_category_id === categoryWithChild.id)
      .map((item) => {
        return {
          ...item,
          child: [],
        } as CategoryWithChild
      })
    if (childs.length > 0) {
      categoryWithChild.child = childs
      childs.forEach((item) => {
        this.getChildCategories(item, allCategories)
      })
    }
  }

  async createCategory(createCategoryDTO: CreateCategoryDTO) {
    try {
      let parentCategory: null | Category = null
      if (createCategoryDTO.parent_category_id) {
        parentCategory = await this.categoryRepository.findOneBy({ id: createCategoryDTO.parent_category_id })
        if (!parentCategory) return null
      }

      const newCategory = this.categoryRepository.create({
        category_name: createCategoryDTO.category_name,
        parentCategory,
      })
      const result = await newCategory.save()
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async assignAttributeSetToCategory(assignAttributeSetDTO: AssignAttributeSetDTO): Promise<Category> {
    try {
      const { attribute_set_id, entity_id } = assignAttributeSetDTO
      const categoryToAssign = await this.categoryRepository.findOne({ where: { id: entity_id } })
      if (!categoryToAssign) return null
      categoryToAssign.attribute_set_id = attribute_set_id
      const result = await categoryToAssign.save()
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

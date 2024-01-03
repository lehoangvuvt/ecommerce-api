import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import CreateCategoryAttributeDTO from 'src/dtos/create-category-attribute.dto'
import CreateCategoryDTO from 'src/dtos/create-category.dto'
import CategoryAttributeMapping from 'src/entities/category-attribute-mapping.entity'
import CategoryAttributeValue from 'src/entities/category-attribute-value.entity'
import CategoryAttribute from 'src/entities/category-attribute.entity'
import Category from 'src/entities/category.entity'
import { Equal, Repository } from 'typeorm'

export type CategoryWithChild = {
  child: CategoryWithChild[]
} & Category

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    @InjectRepository(CategoryAttribute) private categoryAttributeRepository: Repository<CategoryAttribute>,
    @InjectRepository(CategoryAttributeValue) private categoryAttributeValueRepository: Repository<CategoryAttributeValue>,
    @InjectRepository(CategoryAttributeMapping) private categoryAttributeMappingRepository: Repository<CategoryAttributeMapping>
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
    categories.forEach((item) => {
      this.getChildCategories(item, allCategories)
    })
    return categories
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

  async createCategoryAttribute(createCategoryAttributeDTO: CreateCategoryAttributeDTO) {
    try {
      const newCategoryAttribute = this.categoryAttributeRepository.create({
        attribute_name: createCategoryAttributeDTO.attribute_name,
      })
      const result = await newCategoryAttribute.save()
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import CreateCategoryDTO from 'src/dtos/create-category.dto'
import Category from 'src/entities/category.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) {}

  async getCategories(): Promise<Category[]> {
    const result = await this.categoryRepository.find()
    return result
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
}

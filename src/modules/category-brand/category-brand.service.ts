import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import CreateCategoryBrandDTO from 'src/dtos/create-category-brand.dto'
import CategoryBrand from 'src/entities/category-brand.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CategoryBrandService {
  constructor(@InjectRepository(CategoryBrand) private categoryBrandRepository: Repository<CategoryBrand>) {}

  async create(createCategoryBrandDTO: CreateCategoryBrandDTO): Promise<CategoryBrand> {
    try {
      const { brand_id, category_id } = createCategoryBrandDTO
      const newCategoryBrand = this.categoryBrandRepository.create({
        category_id,
        brand_id,
      })
      const result = newCategoryBrand.save()
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

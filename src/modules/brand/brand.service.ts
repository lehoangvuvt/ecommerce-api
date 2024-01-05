import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import CreateBrandDTO from 'src/dtos/create-brand.dto'
import Brand from 'src/entities/brand.entity'
import { Repository } from 'typeorm'

@Injectable()
export class BrandService {
  constructor(@InjectRepository(Brand) private brandRepository: Repository<Brand>) {}

  async getBrands(): Promise<Brand[]> {
    const brands = await this.brandRepository.find()
    return brands
  }

  async createBrand(createBrandDTO: CreateBrandDTO): Promise<Brand> {
    const { brandName } = createBrandDTO
    try {
      const newBrand = this.brandRepository.create({
        brand_name: brandName,
      })
      const result = await newBrand.save()
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

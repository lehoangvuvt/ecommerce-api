import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import CreateProductDTO from 'src/dtos/create-product.dto'
import Category from 'src/entities/category.entity'
import Product from 'src/entities/product.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private productRepository: Repository<Product>) {}

  async getAllProducts() {
    const result = await this.productRepository.find()
    return result
  }

  async createProduct(createProductDTO: CreateProductDTO) {
    const { brand_id, category_id, description, product_name } = createProductDTO
    const newProduct = this.productRepository.create({
      product_name,
      description,
      category_id,
      brand_id,
    })
    await newProduct.save()
  }
}

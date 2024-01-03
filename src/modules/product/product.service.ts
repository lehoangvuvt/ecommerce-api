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

  async createProduct(createProductDTO: CreateProductDTO, category: Category) {
    const newProduct = this.productRepository.create({
      product_name: createProductDTO.product_name,
      description: createProductDTO.description,
      category,
    })
    await newProduct.save()
  }
}

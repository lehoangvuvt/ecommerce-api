import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import CreateCategoryDTO from 'src/dtos/create-category.dto'
import CreateProductDTO from 'src/dtos/create-product.dto'
import Category from 'src/entities/category.entity'
import Product from 'src/entities/product.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>
  ) {}

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

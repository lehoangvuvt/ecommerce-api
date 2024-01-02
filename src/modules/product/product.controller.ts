import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseInterceptors } from '@nestjs/common'
import { ProductService } from './product.service'
import { Response } from 'express'
import CreateCategoryDTO from 'src/dtos/create-category.dto'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  async getAllProduct(@Res() res: Response) {
    const response = await this.productService.getAllProducts()
    return res.status(200).json([])
  }

  @Post('/category')
  async createNewCategory(@Body() createCategoryDTO: CreateCategoryDTO, @Res() res: Response) {
    const response = await this.productService.createCategory(createCategoryDTO)
    if (!response) return res.status(404).json({ error: 'Something error' })
    return res.status(200).json(response)
  }
}

import { Controller, Get, Post, Res } from '@nestjs/common'
import { ProductService } from './product.service'
import { Response } from 'express'
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import CreateProductDTO from 'src/dtos/create-product.dto'
import Product from 'src/entities/product.entity'

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  async getAllProduct(@Res() res: Response) {
    const response = await this.productService.getAllProducts()
    return res.status(200).json(response)
  }

  @ApiBody({ type: CreateProductDTO })
  @ApiCreatedResponse({ description: 'The record has been successfully created.', type: Product })
  @Post('/')
  async createNewProduct() {}
}

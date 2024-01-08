import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common'
import { ProductService } from './product.service'
import { Response } from 'express'
import { ApiBody, ApiCreatedResponse, ApiParam, ApiTags } from '@nestjs/swagger'
import CreateProductDTO from 'src/dtos/create-product.dto'
import Product from 'src/entities/product.entity'

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get('/')
  async getAllProduct(@Res() res: Response) {
    const response = await this.service.getAllProducts()
    return res.status(200).json(response)
  }

  @ApiParam({ name: 'id', type: String })
  @Get('/:id')
  async getProductDetails(@Param() params: { id: string }, @Res() res: Response) {
    const response = await this.service.getProductDetails(params.id)
    return res.status(200).json(response)
  }

  @ApiBody({ type: CreateProductDTO })
  @ApiCreatedResponse({ description: 'The record has been successfully created.', type: Product })
  @Post('/')
  async createNewProduct(@Body() createProductDTO: CreateProductDTO, @Res() res: Response) {
    const response = await this.service.createProduct(createProductDTO)
    if (!response) return res.status(401).json({ error: 'Something error' })
    return res.status(201).json(response)
  }
}

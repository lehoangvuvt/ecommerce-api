import { Controller, Get, Res } from '@nestjs/common'
import { ProductService } from './product.service'
import { Response } from 'express'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  async getAllProduct(@Res() res: Response) {
    const response = await this.productService.getAllProducts()
    return res.status(200).json([])
  }
}

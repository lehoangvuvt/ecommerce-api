import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ProductService } from './product.service'
import { Response } from 'express'
import { ApiBody, ApiCreatedResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import CreateProductDTO from 'src/dtos/create-product.dto'
import Product from 'src/entities/product.entity'
import { TokenVerifyGuard } from '../auth/tokenVerify.guard'
import CreateProductVarianceReviewDTO from 'src/dtos/create-product-variance-review.dto'
import ProductVarianceReview from 'src/entities/product-variance-review.entity'

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get('/')
  async getAllProduct(@Res() res: Response) {
    const response = await this.service.getAllProducts()
    return res.status(200).json(response)
  }

  @ApiParam({ name: 'slug', type: String })
  @Get('/:slug')
  async getProductDetails(@Param() params: { slug: string }, @Res() res: Response) {
    const response = await this.service.getProductDetails(params.slug)
    return res.status(200).json(response)
  }

  @ApiParam({ name: 'searchParams', type: String })
  @Get('/search/:searchParams')
  async searchProducts(@Param() params: { searchParams: string }, @Res() res: Response) {
    const response = await this.service.searchProducts(params.searchParams)
    return res.status(200).json(response)
  }

  @ApiParam({ name: 'searchParams', type: String })
  @Get('/search/search-filters/:searchParams')
  async getSearchFilters(@Param() params: { searchParams: string }, @Res() res: Response) {
    const response = await this.service.getSearchFilters(params.searchParams)
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

  @ApiResponse({ type: [Product], status: 200 })
  @ApiParam({ type: String, name: 'slug' })
  @Get('/similar-products/:slug')
  async getSimilarProducts(@Param() param: { slug: string }, @Res() res: Response) {
    const response = await this.service.getSimilarProducts(param.slug)
    return res.status(200).json(response)
  }

  @UseGuards(TokenVerifyGuard)
  @ApiBody({ type: CreateProductVarianceReviewDTO })
  @ApiCreatedResponse({ description: 'The record has been successfully created.', type: ProductVarianceReview })
  @Post('/review')
  async createProductVarianceReview(@Req() req: any, @Body() createProductVarianceReviewDTO: CreateProductVarianceReviewDTO, @Res() res: Response) {
    const userId = req.id
    const response = await this.service.createProductVarianceReview(createProductVarianceReviewDTO, userId)
    if (!response) return res.status(401).json({ Error: 'Something error' })
    return res.status(201).json(response)
  }

  @ApiParam({ name: 'queryParams', type: String })
  @Get('/review/:queryParams')
  async getProductReviews(@Param() params: { queryParams: string }, @Res() res: Response) {
    const response = await this.service.getProductReviews(params.queryParams)
    return res.status(200).json(response)
  }
}

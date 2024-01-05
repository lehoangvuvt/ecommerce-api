import { Body, Controller, Get, Post, Res } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { BrandService } from './brand.service'
import CreateBrandDTO from 'src/dtos/create-brand.dto'
import Brand from 'src/entities/brand.entity'
import { Response } from 'express'

@ApiTags('Brand')
@Controller('brand')
export class BrandController {
  constructor(private readonly service: BrandService) {}

  @ApiResponse({ status: 200, type: [Brand] })
  @Get('/')
  async get(@Res() res: Response) {
    const response = await this.service.getBrands()
    return res.status(200).json(response)
  }

  @ApiBody({ type: CreateBrandDTO })
  @ApiCreatedResponse({ description: 'The record has been successfully created.', type: Brand })
  @Post('/')
  async create(@Body() body: CreateBrandDTO, @Res() res: Response) {
    const response = await this.service.createBrand(body)
    if (!response) return res.status(400).json({ error: 'Something error' })
    return res.status(201).json(response)
  }
}

import { Body, Controller, Post, Res } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { CategoryBrandService } from './category-brand.service'
import CreateCategoryBrandDTO from 'src/dtos/create-category-brand.dto'
import CategoryBrand from 'src/entities/category-brand.entity'
import { Response } from 'express'

@ApiTags('Category Brand')
@Controller('category-brand')
export class CategoryBrandController {
  constructor(private readonly service: CategoryBrandService) {}

  @ApiBody({ type: CreateCategoryBrandDTO })
  @ApiCreatedResponse({ description: 'The record has been successfully created.', type: CategoryBrand })
  @Post('/')
  async create(@Body() createCategoryBrandDTO: CreateCategoryBrandDTO, @Res() res: Response) {
    const response = await this.service.create(createCategoryBrandDTO)
    if (!response) return res.status(400).json({ error: 'Something error' })
    return res.status(201).json(response)
  }
}

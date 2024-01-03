import { Body, Controller, Get, Post, Res } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import CreateCategoryDTO from 'src/dtos/create-category.dto'
import Category from 'src/entities/category.entity'
import { CategoryService } from './category.service'

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @ApiResponse({ status: 200, type: [Category] })
  @Get('/')
  async getCategories(@Res() res: Response) {
    const response = await this.service.getCategories()
    return res.status(200).json(response)
  }

  @ApiBody({ type: CreateCategoryDTO })
  @ApiCreatedResponse({ description: 'The record has been successfully created.', type: Category })
  @Post('/')
  async createNewCategory(@Body() createCategoryDTO: CreateCategoryDTO, @Res() res: Response) {
    const response = await this.service.createCategory(createCategoryDTO)
    if (!response) return res.status(404).json({ error: 'Something error' })
    return res.status(201).json(response)
  }
}

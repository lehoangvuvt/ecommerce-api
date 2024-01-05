import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import CreateCategoryDTO from 'src/dtos/create-category.dto'
import Category from 'src/entities/category.entity'
import { CategoryService } from './category.service'
import { CategoryWithChild } from 'src/types/response.types'
import CategoryDetails from 'src/dtos/category-details.dto'
import AssignAttributeSetDTO from 'src/dtos/assign-attribute-set.dto'

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @ApiResponse({ status: 200, type: [CategoryWithChild] })
  @Get('/')
  async getCategories(@Res() res: Response) {
    const response = await this.service.getCategories()
    return res.status(200).json(response)
  }

  @ApiResponse({ status: 200, type: CategoryDetails })
  @ApiParam({ name: 'id', type: String })
  @Get('/:id')
  async getCategoryDetails(@Param() params: { id: string }, @Res() res: Response) {
    const response = await this.service.getCategoryDetails(params.id)
    if (!response) return res.status(400).json({ error: 'Not found' })
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

  @ApiBody({ type: AssignAttributeSetDTO })
  @ApiResponse({ status: 200, description: 'Set attribute set to category success.', type: Category })
  @Patch('/assign-attribute-set')
  async assignAttributeSetToCategory(@Body() assignAttributeSetDTO: AssignAttributeSetDTO, @Res() res: Response) {
    const response = await this.service.assignAttributeSetToCategory(assignAttributeSetDTO)
    if (!response) return res.status(404).json({ error: 'Something error' })
    return res.status(200).json(response)
  }
}

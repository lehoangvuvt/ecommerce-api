import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { StoreService } from './store.service'
import { Response } from 'express'
import CreateStoreDTO from 'src/dtos/create-store.dto'
import Store from 'src/entities/store.entity'

@ApiTags('Store')
@Controller('store')
export class StoreController {
  constructor(private readonly service: StoreService) {}

  @ApiParam({ name: 'url', type: String })
  @ApiResponse({ type: Store, status: 200 })
  @Get('/:url')
  async getStoreDetails(@Param() params: { url: string }, @Res() res: Response) {
    console.log(params.url)
    const response = await this.service.getStoreDetails(params.url)
    if (!response) return res.status(404).json({ error: 'Not find any store with given url' })
    return res.status(200).json(response)
  }

  @ApiBody({ type: CreateStoreDTO })
  @ApiCreatedResponse({ description: 'The record has been successfully created.', type: Store })
  @Post('/')
  async createNewStore(@Body() createStoreDTO: CreateStoreDTO, @Res() res: Response) {
    const response = await this.service.createStore(createStoreDTO)
    if (!response) return res.status(401).json({ error: 'Something error' })
    return res.status(401).json(response)
  }
}

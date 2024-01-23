import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common'
import { ApiParam, ApiTags } from '@nestjs/swagger'
import { SearchService } from './search.service'
import { Response } from 'express'

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly service: SearchService) {}

  @ApiParam({ name: 'term', type: String })
  @Get('/suggestion/:term')
  async getSuggestedSearchTerms(@Param() params: { term: string }, @Res() res: Response) {
    const response = await this.service.getSuggestedSearchTerms(params.term)
    return res.status(200).json(response)
  }

  @Get('/popular-search-terms')
  async getPopuplarSearchTerms(@Res() res: Response) {
    const response = await this.service.getPopularSearchTerms()
    return res.status(200).json(response)
  }
}

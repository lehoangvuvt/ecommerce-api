import { Body, Controller, Post, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { KeywordService } from './keyword.service'
import { Response } from 'express'

@ApiTags('keyword')
@Controller('keyword')
export class KeywordController {
  constructor(private readonly service: KeywordService) {}

  @Post('/')
  async insertKeyword(@Body() body: { document: string }, @Res() res: Response) {
    const response = await this.service.insertWords(body.document)
    return res.status(200).json(response)
  }
}

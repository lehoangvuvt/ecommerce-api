import { Body, Controller, Post, Res } from '@nestjs/common'
import MailService from './mail.service'
import { Response } from 'express'
import SendMailDTO from 'src/dtos/send-mail.dto'
import { ApiBody, ApiTags } from '@nestjs/swagger'

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly service: MailService) {}

  @ApiBody({ type: SendMailDTO })
  @Post('send-email')
  async sendEmail(@Body() sendMailDTO: SendMailDTO, @Res() res: Response) {
    const isSuccess = this.service.testTaskMailQueue(sendMailDTO)
    if (!isSuccess) return res.status(400).json('Send email failed')
    return res.status(200).json('Send email success')
  }
}

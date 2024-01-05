import { Controller, Get, Post, Body, Res } from '@nestjs/common'
import { Response } from 'express'
import { UploadedFilesService } from './upload-files.service'
import { UploadFileDTO, UploadFileRes } from 'src/dtos/upload-file.dto'
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Files')
@Controller('files')
export class UploadedFilesController {
  constructor(private readonly service: UploadedFilesService) {}

  @ApiBody({ type: UploadFileDTO })
  @ApiCreatedResponse({ description: 'Uploaded successfull.', type: UploadFileRes })
  @Post('upload')
  async upload(@Body() uploadFileDTO: UploadFileDTO, @Res() res: Response) {
    const response = await this.service.uploadToCloudinary(uploadFileDTO)
    if (response) {
      return res.status(200).json(response)
    } else {
      return res.status(401).send({ error: 'Error at upload file: ' + uploadFileDTO.name })
    }
  }
}

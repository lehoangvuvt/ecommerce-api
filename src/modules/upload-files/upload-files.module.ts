import { Module } from '@nestjs/common'
import { UploadedFilesService } from './upload-files.service'
import { UploadedFilesController } from './upload-files.controller'

@Module({
  imports: [],
  controllers: [UploadedFilesController],
  providers: [UploadedFilesService],
  exports: [UploadedFilesService],
})
export class UploadedFilesModule {}

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

class UploadFileDTO {
  @ApiProperty({
    description: 'Name of file',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'Type of file (ex: png, mp4)',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  type: string

  @ApiProperty({
    description: 'Content base64 of file',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  base64: string
}

class UploadFileRes {
  @ApiProperty()
  public_id: string

  @ApiProperty()
  width: number

  @ApiProperty()
  height: number

  @ApiProperty()
  format: string

  @ApiProperty()
  resource_type: 'image' | 'video' | 'raw' | 'auto'

  @ApiProperty()
  created_at: string

  @ApiProperty()
  original_filename: string

  @ApiProperty()
  secure_url: string
}

export { UploadFileDTO, UploadFileRes }

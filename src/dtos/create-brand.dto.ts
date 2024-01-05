import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export default class CreateBrandDTO {
  @ApiProperty({ type: String, description: 'Name of brand', required: true })
  @IsString()
  @IsNotEmpty()
  brandName: string
}

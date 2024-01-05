import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export default class CreateCategoryBrandDTO {
  @ApiProperty({ type: String, description: 'Id of brand', required: true })
  @IsString()
  @IsNotEmpty()
  brand_id: string

  @ApiProperty({ type: String, description: 'Id of category', required: true })
  @IsString()
  @IsNotEmpty()
  category_id: string
}

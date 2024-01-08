import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export default class CreateAttributeValueDTO {
  @ApiProperty({ type: String, description: 'ID of attribute', required: true })
  @IsString()
  attribute_id: string

  @ApiProperty({ type: String, description: 'attribute value', required: false })
  value: string
}

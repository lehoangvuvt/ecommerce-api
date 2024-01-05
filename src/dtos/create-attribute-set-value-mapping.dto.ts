import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export default class CreateAttributeSetValueMappingDTO {
  @ApiProperty({ type: String, description: 'ID of attribute set', required: true })
  @IsString()
  attribute_set_id: string

  @ApiProperty({ type: String, description: 'ID of attribute value', required: true })
  @IsString()
  attribute_value_id: string
}

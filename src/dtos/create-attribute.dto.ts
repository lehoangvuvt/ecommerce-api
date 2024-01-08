import { ApiProperty } from '@nestjs/swagger'

export default class CreateAttributeDTO {
  @ApiProperty({ type: String, description: 'Name of attribute', required: true })
  attribute_name: string

  @ApiProperty({ type: Number, description: `Value type of this attribute. 0: decimal, 1: int, 2: string`, required: true })
  value_type: number

  @ApiProperty({ type: Boolean, description: 'True if attribute is primary, false if not, default is false', required: true })
  is_primary: boolean
}

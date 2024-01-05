import { ApiProperty } from '@nestjs/swagger'

export default class CreateAttributeDTO {
  @ApiProperty({ type: String, description: 'Name of attribute' })
  attribute_name: string

  @ApiProperty({ type: Number, description: `Value type of this attribute. 0: decimal, 1: int, 2: string` })
  value_type: number
}

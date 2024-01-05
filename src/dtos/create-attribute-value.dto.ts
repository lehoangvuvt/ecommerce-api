import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export default class CreateAttributeValueDTO {
  @ApiProperty({ type: String, description: 'ID of attribute', required: true })
  @IsString()
  attribute_id: string

  @ApiProperty({ type: Number, description: 'Decimal value', required: false })
  value_decimal?: number

  @ApiProperty({ type: Number, description: 'Integer value', required: false })
  value_int?: number

  @ApiProperty({ type: String, description: 'String value', required: false })
  value_string?: string
}

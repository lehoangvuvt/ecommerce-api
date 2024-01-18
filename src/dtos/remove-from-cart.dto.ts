import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'

export default class RemoveFromCartDTO {
  @ApiProperty({ type: String, description: 'Product variance id', required: true })
  @IsString()
  @IsNotEmpty()
  product_variance_id: string
}

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'

export default class AddToCartDTO {
  @ApiProperty({ type: String, description: 'Product variance id', required: true })
  @IsString()
  @IsNotEmpty()
  product_variance_id: string

  @ApiProperty({ type: Number, description: 'Quantity of product', required: true })
  @IsNumber()
  @Min(1)
  quantity: number
}

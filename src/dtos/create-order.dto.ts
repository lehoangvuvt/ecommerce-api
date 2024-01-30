import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsString } from 'class-validator'

class CreateOrder_Item {
  @ApiProperty({ type: String, description: 'Product variance id', required: true })
  product_variance_id: string

  @ApiProperty({ type: Number, description: 'Quantity of product variance', required: true })
  quantity: number
}

export default class CreateOrderDTO {
  @ApiProperty({ type: String, description: 'Country', required: true })
  @IsString()
  @IsNotEmpty()
  country: string

  @ApiProperty({ type: String, description: 'City', required: true })
  @IsString()
  @IsNotEmpty()
  city: string

  @ApiProperty({ type: String, description: 'District', required: true })
  @IsString()
  @IsNotEmpty()
  district: string

  @ApiProperty({ type: String, description: 'Address', required: true })
  @IsString()
  @IsNotEmpty()
  address: string

  @ApiProperty({ type: String, description: 'First name', required: true })
  @IsString()
  @IsNotEmpty()
  firstName: string

  @ApiProperty({ type: String, description: 'Last name', required: true })
  @IsString()
  @IsNotEmpty()
  lastName: string

  @ApiProperty({ type: String, description: 'Phone', required: true })
  @IsString()
  @IsNotEmpty()
  phone: string

  @ApiProperty({ type: CreateOrder_Item, isArray: true })
  @IsArray()
  @IsNotEmpty()
  items: CreateOrder_Item[]
}

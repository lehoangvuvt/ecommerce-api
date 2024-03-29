import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export type CProductProducVariance = {
  imageURL: string
  mainAttribute: {
    name: string
    value: any
  }
  subAttribute: {
    name: string
    values: {
      quantity: number
      price: number
      value: any
    }[]
  }
}

class CreateProductDTO {
  @ApiProperty({
    description: 'Name of product',
    type: String,
    required: true,
  })
  @IsString()
  product_name: string

  @ApiProperty({
    description: 'Description of product',
    type: String,
    required: true,
  })
  @IsString()
  description: string

  @ApiProperty({
    description: "Category's ID of product",
    type: String,
    required: true,
  })
  @IsString()
  category_id: string

  @ApiProperty({
    description: "Brand's ID of product",
    type: String,
    required: true,
  })
  @IsString()
  brand_id: string

  @ApiProperty({
    description: 'ID of attribute set assign to product',
    type: Object,
    required: true,
  })
  productAttributes: { [key: string]: any }

  @ApiProperty({
    description: 'List of images URLs of the product',
    type: String,
    required: true,
    isArray: true,
  })
  images: string[]

  @ApiProperty({
    description: 'Product variances',
    type: Object,
    isArray: true,
    required: true,
  })
  productVariances: CProductProducVariance[]
}

export default CreateProductDTO

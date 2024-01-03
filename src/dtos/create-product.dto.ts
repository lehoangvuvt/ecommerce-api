import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

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
}

export default CreateProductDTO

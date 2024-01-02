import { IsString } from 'class-validator'

class CreateProductDTO {
  @IsString()
  product_name: string

  @IsString()
  description: string

  @IsString()
  category_id: string
}

export default CreateProductDTO

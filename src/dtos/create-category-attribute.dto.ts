import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

class CreateCategoryAttributeDTO {
  @ApiProperty({
    description: 'Name of attribute',
    type: String,
    required: true,
  })
  @IsString()
  attribute_name: string
}

export default CreateCategoryAttributeDTO

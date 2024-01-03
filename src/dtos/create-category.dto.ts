import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

class CreateCategoryDTO {
  @ApiProperty({
    description: 'Name of category',
    type: String,
    required: true,
  })
  @IsString()
  category_name: string

  @ApiProperty({
    description: 'Id of parent category, not required for root category',
    type: String,
    required: false,
  })
  parent_category_id: string | null
}

export default CreateCategoryDTO

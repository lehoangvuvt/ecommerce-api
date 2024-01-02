import { IsString } from 'class-validator'

class CreateCategoryDTO {
  @IsString()
  category_name: string 

  parent_category_id: string | null
}

export default CreateCategoryDTO

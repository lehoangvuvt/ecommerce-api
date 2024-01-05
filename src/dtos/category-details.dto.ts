import { ApiProperty } from '@nestjs/swagger'
import Brand from 'src/entities/brand.entity'
import { AttributeWithValues } from 'src/modules/category/category.service'

export default class CategoryDetailsDTO {
  @ApiProperty({ type: String, description: 'Name of category' })
  category_name: string

  @ApiProperty({ type: String, description: `ID of this category 's parent category` })
  parent_category_id: string

  @ApiProperty({
    type: [Brand],
    description: `List of brands that belongs to this category`,
  })
  brands: Brand[]

  @ApiProperty({ type: Array })
  groupedAttributeWithValues: AttributeWithValues[]
}

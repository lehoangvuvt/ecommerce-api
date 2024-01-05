import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import Brand from 'src/entities/brand.entity'

export default class CreateAttributeSetDTO {
  @ApiProperty({ type: String, description: 'Type of entity: CATEGORY, PRODUCT_VARIANCE', required: true })
  @IsString()
  entity_type: string

  @ApiProperty({ type: String, description: 'ID of category', required: false })
  category_id?: string

  @ApiProperty({ type: String, description: 'ID of product variance', required: false })
  product_variance_id?: string
}

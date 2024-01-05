import { ApiProperty } from '@nestjs/swagger'

export default class AssignAttributeSetDTO {
  @ApiProperty({ type: String, description: `ID of entity to assign attribute set. It can be Category Id or Product Variance Id`, required: true })
  entity_id: string

  @ApiProperty({ type: String, description: `ID of attribute set`, required: true })
  attribute_set_id: string
}

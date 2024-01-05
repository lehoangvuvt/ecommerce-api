import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import CustomBase from './base'
import Attribute from './attribute.entity'
import { ApiProperty } from '@nestjs/swagger'
import AttributeSetValueMapping from './attribute-set-value-mapping.entity'

@Entity()
class AttributeValue extends CustomBase {
  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  attribute_id: string

  @ApiProperty()
  @Column({ type: 'decimal', precision: 2, width: 10, nullable: true })
  value_decimal: number

  @ApiProperty()
  @Column({ type: 'int8', nullable: true })
  value_int: number

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  value_string: string

  @ManyToOne(() => Attribute, (attribute) => attribute.attributeValues, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'attribute_id' })
  attribute: Attribute

  @OneToMany(() => AttributeSetValueMapping, (attrSetValueMapping) => attrSetValueMapping.attributeValue)
  attributeSetValueMappings: AttributeSetValueMapping[]
}

export default AttributeValue

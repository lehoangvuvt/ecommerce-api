import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import CustomBase from './base'
import ProductVariance from './product-variance.entity'
import Category from './category.entity'
import { ApiProperty } from '@nestjs/swagger'
import AttributeSet from './attribute-set.entity'
import AttributeValue from './attribute-value.entity'

@Entity()
class AttributeSetValueMapping extends CustomBase {
  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  attribute_set_id: string

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  attribute_value_id: string

  @ManyToOne(() => AttributeSet, (attributeSet) => attributeSet.attributeSetValueMappings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'attribute_set_id' })
  attributeSet: AttributeSet

  @ManyToOne(() => AttributeValue, (attributeValue) => attributeValue.attributeSetValueMappings, { eager: true })
  @JoinColumn({ name: 'attribute_value_id' })
  attributeValue: AttributeValue
}

export default AttributeSetValueMapping

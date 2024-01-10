import { Column, Entity, Index, OneToMany } from 'typeorm'
import CustomBase from './base'
import AttributeValue from './attribute-value.entity'

@Entity()
class Attribute extends CustomBase {
  @Column({ unique: true, type: 'varchar', nullable: false })
  attribute_name: string

  //0: decimal, 1: int, 2: string
  @Column({ type: 'int2', default: 0 })
  value_type: number

  @Column({ type: 'boolean', default: false })
  is_primary: boolean

  @Column({ type: 'varchar', unique: true, nullable: false })
  @Index()
  short_id: string

  @OneToMany(() => AttributeValue, (attributeValue) => attributeValue.attribute, { cascade: true })
  attributeValues: AttributeValue[]
}

export default Attribute

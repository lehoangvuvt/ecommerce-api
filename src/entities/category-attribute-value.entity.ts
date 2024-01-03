import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import CustomBase from './base'
import ProductAttribute from './product-attribute.entity'

@Entity()
class CategoryAttributeValue extends CustomBase {
  @Column({ unique: true, type: 'varchar', nullable: false })
  name: string

  @Column({ type: 'varchar', nullable: false })
  value: string

  @ManyToOne(() => ProductAttribute, (productAttribute) => productAttribute.productAttributeValues)
  @JoinColumn({ name: 'attribute_id' })
  productAttribute: ProductAttribute
}

export default CategoryAttributeValue

import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import CustomBase from './base'
import ProductAttribute from './product-attribute.entity'
import ProductVariance from './product-variance.entity'

@Entity()
class ProductAttributeValue extends CustomBase {
  @Column({ unique: true, type: 'varchar', nullable: false })
  name: string

  @Column({ type: 'varchar', nullable: false })
  value: string

  @ManyToOne(() => ProductAttribute, (productAttribute) => productAttribute.productAttributeValues)
  @JoinColumn({ name: 'attribute_id' })
  productAttribute: ProductAttribute

  @OneToMany(() => ProductVariance, (productVariance) => productVariance.productAttributeValue1)
  productVariances1: ProductVariance[]

  @OneToMany(() => ProductVariance, (productVariance) => productVariance.productAttributeValue2)
  productVariances2: ProductVariance[]
}

export default ProductAttributeValue

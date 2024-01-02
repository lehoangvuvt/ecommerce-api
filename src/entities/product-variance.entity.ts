import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import CustomBase from './base'
import ProductAttributeValue from './product-attribute-value.entity'
import Product from './product.entity'

@Entity()
class ProductVariance extends CustomBase {
  @Column({ unique: true, type: 'varchar', nullable: false })
  name: string

  @Column({ unique: true, type: 'varchar', nullable: false })
  attribute_name: string

  @ManyToOne(() => Product, (product) => product.productVariances)
  @JoinColumn({ name: 'product_id' })
  product: Product

  @ManyToOne(() => ProductAttributeValue, (productAttributeValue) => productAttributeValue.productVariances1)
  @JoinColumn({ name: 'main_attribute_value_id' })
  productAttributeValue1: ProductAttributeValue

  @ManyToOne(() => ProductAttributeValue, (productAttributeValue) => productAttributeValue.productVariances2)
  @JoinColumn({ name: 'sub_attribute_value_id' })
  productAttributeValue2: ProductAttributeValue

  @Column({ type: 'int2', default: 0 })
  quantity: number
}

export default ProductVariance

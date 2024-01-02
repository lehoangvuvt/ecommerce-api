import { Column, Entity, OneToMany } from 'typeorm'
import CustomBase from './base'
import ProductAttributeValue from './product-attribute-value.entity'

@Entity()
class ProductAttribute extends CustomBase {
  @Column({ unique: true, type: 'varchar', nullable: false })
  name: string

  @Column({ unique: true, type: 'varchar', nullable: false })
  attribute_name: string

  @OneToMany(() => ProductAttributeValue, (productAttributeValue) => productAttributeValue.productAttribute)
  productAttributeValues: ProductAttributeValue[]
}

export default ProductAttribute

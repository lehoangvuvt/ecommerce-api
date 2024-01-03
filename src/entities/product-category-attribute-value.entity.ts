import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import CustomBase from './base'
import CategoryAttribute from './category-attribute.entity'
import Product from './product.entity'

@Entity()
class ProductCategoryAttributeValue extends CustomBase {
  @Column({ type: 'varchar', nullable: false })
  value: string

  @ManyToOne(() => Product, (product) => product.productCategoryAttributeValues)
  @JoinColumn({ name: 'product_id'})
  product: Product

  @ManyToOne(() => CategoryAttribute, (categoryAttribute) => categoryAttribute.productCategoryAttributeValues )
  @JoinColumn({ name: 'category_attribute_id'})
  categoryAttribute: CategoryAttribute
}

export default ProductCategoryAttributeValue

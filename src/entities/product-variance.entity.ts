import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import CustomBase from './base'
import Product from './product.entity'
import ProductImage from './product-variance-image.entity'
import ProductPriceHistory from './product-price-history.entity'
import CartItem from './cart-item.entity'
import OrderItem from './order-item.entity'
import ProductVarianceImage from './product-variance-image.entity'
import AttributeSet from './attribute-set.entity'

@Entity()
class ProductVariance extends CustomBase {
  @Column({ unique: true, type: 'varchar', nullable: false })
  name: string

  @Column({ unique: true, type: 'varchar', nullable: false })
  attribute_name: string

  @Column({ type: 'varchar', nullable: true })
  attribute_set_id: string

  @Column({ type: 'int2', nullable: false, default: 0 })
  quantity: number

  @ManyToOne(() => Product, (product) => product.productVariances)
  @JoinColumn({ name: 'product_id' })
  product: Product

  @OneToMany(() => ProductImage, (productImage) => productImage.productVariance)
  productImages: ProductImage[]

  @OneToMany(() => ProductPriceHistory, (productPriceHistory) => productPriceHistory.productVariance)
  productPriceHistories: ProductVarianceImage[]

  @OneToMany(() => CartItem, (cartItem) => cartItem.productVariance)
  cartItems: CartItem[]

  @OneToMany(() => OrderItem, (orderItem) => orderItem.productVariance)
  orderItems: OrderItem[]

  @ManyToOne(() => AttributeSet, (attributeSet) => attributeSet.productVariances)
  @JoinColumn({ name: 'attribute_set_id' })
  attributeSet: AttributeSet
}

export default ProductVariance

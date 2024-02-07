import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import CustomBase from './base'
import Product from './product.entity'
import ProductImage from './product-variance-image.entity'
import ProductPriceHistory from './product-price-history.entity'
import CartItem from './cart-item.entity'
import OrderItem from './order-item.entity'
import AttributeSet from './attribute-set.entity'
import CheckoutItem from './checkout-item.entity'
import { ApiProperty } from '@nestjs/swagger'
import ProductVarianceReview from './product-variance-review.entity'

@Entity()
class ProductVariance extends CustomBase {
  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  product_id: string

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  attribute_set_id: string

  @ApiProperty()
  @Column({ type: 'int2', nullable: false, default: 0 })
  quantity: number

  @ManyToOne(() => Product, (product) => product.productVariances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product

  @OneToMany(() => ProductImage, (productImage) => productImage.productVariance, { eager: true })
  productVarianceImages: ProductImage[]

  @OneToMany(() => ProductPriceHistory, (productPriceHistory) => productPriceHistory.productVariance, { eager: true })
  productPriceHistories: ProductPriceHistory[]

  @OneToMany(() => CartItem, (cartItem) => cartItem.productVariance)
  cartItems: CartItem[]

  @OneToMany(() => OrderItem, (orderItem) => orderItem.productVariance)
  orderItems: OrderItem[]

  @ManyToOne(() => AttributeSet, (attributeSet) => attributeSet.productVariances, { eager: true })
  @JoinColumn({ name: 'attribute_set_id' })
  attributeSet: AttributeSet

  @OneToOne(() => CheckoutItem, (checkoutItem) => checkoutItem.productVariance)
  checkoutItems: CheckoutItem[]

  @OneToMany(() => ProductVarianceReview, (productVarianceReview) => productVarianceReview.productVariance, { eager: true })
  productVarianceReviews: ProductVarianceReview[]
}

export default ProductVariance

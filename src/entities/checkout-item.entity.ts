import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import CustomBase from './base'
import ProductVariance from './product-variance.entity'
import { ApiProperty } from '@nestjs/swagger'
import Checkout from './checkout.entity'

@Entity()
class CheckoutItem extends CustomBase {
  @Column({ type: 'int2', nullable: false, default: 0 })
  quantity: number

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  checkout_id: string

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  product_variance_id: string

  @ManyToOne(() => Checkout, (checkout) => checkout.checkoutItems)
  @JoinColumn({ name: 'checkout_id' })
  checkout: Checkout

  @ApiProperty()
  @ManyToOne(() => ProductVariance, (productVariance) => productVariance.checkoutItems, { eager: true })
  @JoinColumn({ name: 'product_variance_id' })
  productVariance: ProductVariance
}

export default CheckoutItem

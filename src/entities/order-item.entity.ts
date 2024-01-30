import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import CustomBase from './base'
import Order from './order.entity'
import ProductVariance from './product-variance.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
class OrderItem extends CustomBase {
  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  product_variance_id: string

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  order_id: string

  @ApiProperty()
  @Column({ type: 'int2', nullable: false, default: 0 })
  quantity: number

  @ApiProperty({ type: [ProductVariance] })
  @ManyToOne(() => ProductVariance, (productVariance) => productVariance.orderItems, { eager: true })
  @JoinColumn({ name: 'product_variance_id' })
  productVariance: ProductVariance

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order
}

export default OrderItem

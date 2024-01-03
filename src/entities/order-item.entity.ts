import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import CustomBase from './base'
import Order from './order.entity'
import ProductVariance from './product-variance.entity'

@Entity()
class OrderItem extends CustomBase {
  @Column({ type: 'int2', nullable: false, default: 0 })
  quantity: number

  @ManyToOne(() => ProductVariance, (productVariance) => productVariance.orderItems)
  @JoinColumn({ name: 'product_variance_id' })
  productVariance: ProductVariance

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order
}

export default OrderItem

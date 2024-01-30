import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import CustomBase from './base'
import User from './user.entity'
import OrderItem from './order-item.entity'
import Order from './order.entity'

@Entity()
class OrderInfo extends CustomBase {
  @Column({ type: 'varchar', nullable: false, unique: true})
  order_id: string;

  @Column({ type: 'varchar', nullable: false })
  country: string

  @Column({ type: 'varchar', nullable: false })
  city: string

  @Column({ type: 'varchar', nullable: false })
  district: string

  @Column({ type: 'varchar', nullable: false })
  address: string

  @Column({ type: 'varchar', nullable: false })
  phone: string

  @Column({ type: 'varchar', nullable: false })
  firstName: string

  @Column({ type: 'varchar', nullable: false })
  lastName: string

  @OneToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order
}

export default OrderInfo

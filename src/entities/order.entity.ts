import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import CustomBase from './base'
import User from './user.entity'
import OrderItem from './order-item.entity'

@Entity()
class Order extends CustomBase {
  @Column({ type: 'int2', nullable: false, default: 0 })
  status: number

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

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[]

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User
}

export default Order

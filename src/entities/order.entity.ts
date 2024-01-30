import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import CustomBase from './base'
import User from './user.entity'
import OrderItem from './order-item.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
class Order extends CustomBase {
  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  user_id: string

  //0: proccessing, 1:
  @ApiProperty()
  @Column({ type: 'int2', nullable: false, default: 0 })
  status: number

  @ApiProperty({ type: [OrderItem] })
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { eager: true })
  items: OrderItem[]

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User
}

export default Order

import { Column, Entity, OneToMany } from 'typeorm'
import CustomBase from './base'
import UserShippingInfo from './user-shipping-info.entity'
import Order from './order.entity'
import { ApiProperty } from '@nestjs/swagger'
import Checkout from './checkout.entity'

@Entity()
class User extends CustomBase {
  @ApiProperty()
  @Column({ unique: true, type: 'varchar', nullable: false })
  username: string

  @Column({ type: 'varchar', nullable: false })
  password: string

  @ApiProperty()
  @OneToMany(() => UserShippingInfo, (userShippingInfo) => userShippingInfo.user, { eager: true })
  userShippingInfos: UserShippingInfo[]

  @ApiProperty()
  @OneToMany(() => Order, (order) => order.user, { eager: true })
  orders: Order[]

  @ApiProperty()
  @OneToMany(() => Checkout, (checkout) => checkout.user, { eager: true })
  checkouts: Checkout[]
}

export default User

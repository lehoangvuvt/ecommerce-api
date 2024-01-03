import { Column, Entity, OneToMany } from 'typeorm'
import CustomBase from './base'
import UserShippingInfo from './user-shipping-info.entity'
import Order from './order.entity'

@Entity()
class User extends CustomBase {
  @Column({ unique: true, type: 'varchar', nullable: false })
  username: string

  @Column({ type: 'varchar', nullable: false })
  password: string

  @OneToMany(() => UserShippingInfo, (userShippingInfo) => userShippingInfo.user)
  userShippingInfos: UserShippingInfo[]

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[]
}

export default User

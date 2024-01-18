import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import CustomBase from './base'
import User from './user.entity'

@Entity()
class UserShippingInfo extends CustomBase {
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

  @Column({ type: 'boolean', nullable: false })
  primary: string

  @Column({ type: 'int2', nullable: false, default: 0 })
  type: number

  @ManyToOne(() => User, (user) => user.userShippingInfos)
  @JoinColumn({ name: 'user_id' })
  user: User
}

export default UserShippingInfo

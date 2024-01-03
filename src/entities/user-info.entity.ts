import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import CustomBase from './base'
import User from './user.entity'

@Entity()
class UserInfo extends CustomBase {
  @Column({ type: 'varchar' })
  first_name: string

  @Column({ type: 'varchar' })
  last_name: string

  @Column({ type: 'varchar', nullable: true })
  email: string

  @Column({ type: 'varchar', nullable: true })
  phone: string

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User
}

export default UserInfo

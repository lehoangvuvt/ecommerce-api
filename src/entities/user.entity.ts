import { Column, Entity } from 'typeorm'
import CustomBase from './base'

@Entity()
class User extends CustomBase {
  @Column({ unique: true, type: 'varchar', nullable: false })
  username: string

  @Column({ type: 'varchar', nullable: false })
  password: string
}

export default User

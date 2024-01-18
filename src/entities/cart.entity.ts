import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm'
import CustomBase from './base'
import User from './user.entity'
import CartItem from './cart-item.entity'

@Entity()
class Cart extends CustomBase {
  @Column({ type: 'varchar', nullable: false, unique: true })
  user_id: string

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { eager: true })
  items: CartItem[]
}

export default Cart

import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import CustomBase from './base'
import User from './user.entity'
import CartItem from './cart-item.entity'

@Entity()
class Cart extends CustomBase {
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  items: CartItem[]
}

export default Cart

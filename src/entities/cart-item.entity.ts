import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import CustomBase from './base'
import Cart from './cart.entity'
import ProductVariance from './product-variance.entity'

@Entity()
class CartItem extends CustomBase {
  @ManyToOne(() => Cart, (cart) => cart.items)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart

  @ManyToOne(() => ProductVariance, (productVariance) => productVariance.cartItems)
  @JoinColumn({ name: 'product_variance_id' })
  productVariance: ProductVariance

  @Column({ type: 'int2', default: 0 })
  quantity: number
}

export default CartItem

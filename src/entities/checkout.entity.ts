import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import CustomBase from './base'
import Category from './category.entity'
import ProductVariance from './product-variance.entity'
import Brand from './brand.entity'
import ProductImage from './product-image.entity'
import { ApiProperty } from '@nestjs/swagger'
import AttributeSet from './attribute-set.entity'
import User from './user.entity'
import CheckoutItem from './checkout-item.entity'

@Entity()
class Checkout extends CustomBase {
  //0: checkout, 1: ordered 
  @ApiProperty()
  @Column({ type: 'int2', nullable: false, default: 0 })
  status: string

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  user_id: string

  @ManyToOne(() => User, (user) => user.checkouts)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ApiProperty()
  @OneToMany(() => CheckoutItem, (checkoutItem) => checkoutItem.checkout, { eager: true })
  checkoutItems: CheckoutItem[]
}

export default Checkout

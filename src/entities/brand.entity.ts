import { Column, Entity, OneToMany } from 'typeorm'
import CustomBase from './base'
import Cart from './cart.entity'
import UserShippingInfo from './user-shipping-info.entity'
import Product from './product.entity'

@Entity()
class Brand extends CustomBase {
  @Column({ unique: true, type: 'varchar', nullable: false })
  brand_name: string

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[]
}

export default Brand

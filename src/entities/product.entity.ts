import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import CustomBase from './base'
import Category from './category.entity'
import ProductVariance from './product-variance.entity'

@Entity()
class Product extends CustomBase {
  @Column({ type: 'varchar', nullable: false })
  product_name: string

  @Column({ type: 'varchar', nullable: false })
  description: string

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category

  @OneToMany(() => ProductVariance, (productVariance) => productVariance)
  productVariances: ProductVariance[]
}

export default Product

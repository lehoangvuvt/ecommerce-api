import { Column, Entity, OneToMany } from 'typeorm'
import CustomBase from './base'
import Product from './product.entity'
import CategoryBrand from './category-brand.entity'

@Entity()
class Brand extends CustomBase {
  @Column({ unique: true, type: 'varchar', nullable: false })
  brand_name: string

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[]

  @OneToMany(() => CategoryBrand, (categoryBrand) => categoryBrand.category)
  brandCategories: CategoryBrand[]
}

export default Brand

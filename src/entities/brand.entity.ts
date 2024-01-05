import { Column, Entity, OneToMany } from 'typeorm'
import CustomBase from './base'
import Product from './product.entity'
import CategoryBrand from './category-brand.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
class Brand extends CustomBase {
  @ApiProperty()
  @Column({ unique: true, type: 'varchar', nullable: false })
  brand_name: string

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[]

  @OneToMany(() => CategoryBrand, (categoryBrand) => categoryBrand.category, { cascade: true })
  brandCategories: CategoryBrand[]
}

export default Brand

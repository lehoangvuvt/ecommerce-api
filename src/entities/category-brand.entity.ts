import { Entity, JoinColumn, ManyToOne } from 'typeorm'
import CustomBase from './base'
import Category from './category.entity'
import Brand from './brand.entity'

@Entity()
class CategoryBrand extends CustomBase {
  @ManyToOne(() => Category, (category) => category.categoryBrands)
  @JoinColumn({ name: 'category_id' })
  category: Category

  @ManyToOne(() => Brand, (brand) => brand.brandCategories)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand
}

export default CategoryBrand

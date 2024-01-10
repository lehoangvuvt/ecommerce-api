import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import CustomBase from './base'
import Product from './product.entity'
import { ApiProperty } from '@nestjs/swagger'
import CategoryBrand from './category-brand.entity'
import AttributeSet from './attribute-set.entity'

@Entity()
class Category extends CustomBase {
  @ApiProperty()
  @Column({ unique: true, type: 'varchar', nullable: false })
  category_name: string

  @ApiProperty()
  @Column('varchar', { nullable: true })
  parent_category_id: string

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  attribute_set_id: string

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false, unique: true })
  slug: string

  @ApiProperty()
  @ManyToOne(() => Category, (category) => category.categories)
  @JoinColumn({ name: 'parent_category_id' })
  parentCategory: Category

  @OneToMany(() => Category, (category) => category.parentCategory)
  categories: Category[]

  @OneToMany(() => Product, (product) => product.category)
  products: Product[]

  @OneToMany(() => CategoryBrand, (categoryBrand) => categoryBrand.brand, { cascade: true })
  categoryBrands: CategoryBrand[]

  @ManyToOne(() => AttributeSet, (attributeSet) => attributeSet.categories)
  @JoinColumn({ name: 'attribute_set_id' })
  attributeSet: AttributeSet
}

export default Category

import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import CustomBase from './base'
import Product from './product.entity'
import { ApiProperty } from '@nestjs/swagger'
import CategoryAttributeMapping from './category-attribute-mapping.entity'
import CategoryAttribute from './category-attribute.entity'
import CategoryBrand from './category-brand.entity'

@Entity()
class Category extends CustomBase {
  @ApiProperty()
  @Column({ unique: true, type: 'varchar', nullable: false })
  category_name: string

  @ApiProperty()
  @Column('varchar', { nullable: true })
  parent_category_id: string

  @ApiProperty()
  @ManyToOne(() => Category, (category) => category.categories)
  @JoinColumn({ name: 'parent_category_id' })
  parentCategory: Category

  @OneToMany(() => Category, (category) => category.parentCategory)
  categories: Category[]

  @OneToMany(() => Product, (product) => product.category)
  products: Product[]

  @OneToMany(() => CategoryAttributeMapping, (categoryAttributeMapping) => categoryAttributeMapping.categoryAttribubeMapping)
  categoryAttributes: CategoryAttribute[]

  @OneToMany(() => CategoryBrand, (categoryBrand) => categoryBrand.category)
  categoryBrands: CategoryBrand[]
}

export default Category

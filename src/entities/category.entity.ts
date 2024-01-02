import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import CustomBase from './base'
import Product from './product.entity'

@Entity()
class Category extends CustomBase {
  @Column({ unique: true, type: 'varchar', nullable: false })
  category_name: string

  @ManyToOne(() => Category, (category) => category.categories)
  @JoinColumn({ name: 'parent_category_id' })
  parentCategory: Category

  @OneToMany(() => Category, (category) => category.parentCategory)
  categories: Category[]

  @OneToMany(() => Product, (product) => product.category)
  products: Product[]
}

export default Category

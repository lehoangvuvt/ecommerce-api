import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import CustomBase from './base'
import Category from './category.entity'
import ProductVariance from './product-variance.entity'
import Brand from './brand.entity'
import ProductImage from './product-image.entity'
import ProductCategoryAttributeValue from './product-category-attribute-value.entity'

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

  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand

  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  images: ProductImage[]

  @OneToMany(() => ProductCategoryAttributeValue, (productCategoryAttributeValue) => productCategoryAttributeValue.product)
  productCategoryAttributeValues: ProductCategoryAttributeValue[]
}

export default Product

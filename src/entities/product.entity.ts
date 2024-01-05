import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import CustomBase from './base'
import Category from './category.entity'
import ProductVariance from './product-variance.entity'
import Brand from './brand.entity'
import ProductImage from './product-image.entity'
import { ApiProperty } from '@nestjs/swagger'
import AttributeSet from './attribute-set.entity'

@Entity()
class Product extends CustomBase {
  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  product_name: string

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  description: string

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  brand_id: string

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  category_id: string

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  attribute_set_id: string

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

  @ManyToOne(() => AttributeSet, (attributeSet) => attributeSet.products)
  @JoinColumn({ name: 'attribute_set_id' })
  attributeSet: AttributeSet
}

export default Product

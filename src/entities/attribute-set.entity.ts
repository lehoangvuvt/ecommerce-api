import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm'
import CustomBase from './base'
import ProductVariance from './product-variance.entity'
import Category from './category.entity'
import { ApiProperty } from '@nestjs/swagger'
import AttributeSetValueMapping from './attribute-set-value-mapping.entity'
import Product from './product.entity'

@Entity()
class AttributeSet extends CustomBase {
  @OneToMany(() => ProductVariance, (productVariance) => productVariance.attributeSet)
  productVariances: ProductVariance[]

  @OneToMany(() => Category, (category) => category.attributeSet)
  categories: Category[]

  @OneToMany(() => AttributeSetValueMapping, (attrSetValueMapping) => attrSetValueMapping.attributeSet, { cascade: true, eager: true })
  attributeSetValueMappings: AttributeSetValueMapping[]

  @OneToMany(() => Product, (product) => product.attributeSet)
  products: Product[]
}

export default AttributeSet

import { Column, Entity, OneToMany } from 'typeorm'
import CustomBase from './base'
import CategoryAttributeMapping from './category-attribute-mapping.entity'
import ProductCategoryAttributeValue from './product-category-attribute-value.entity'

@Entity()
class CategoryAttribute extends CustomBase {
  @Column({ unique: true, type: 'varchar', nullable: false })
  name: string

  @Column({ unique: true, type: 'varchar', nullable: false })
  attribute_name: string

  @OneToMany(() => CategoryAttributeMapping, (categoryAttributeMapping) => categoryAttributeMapping.attributeCategoryMapping)
  attributeCategories: CategoryAttribute[]

  @OneToMany(() => ProductCategoryAttributeValue, (productCategoryAttributeValue) => productCategoryAttributeValue.categoryAttribute)
  productCategoryAttributeValues: ProductCategoryAttributeValue[]
}

export default CategoryAttribute

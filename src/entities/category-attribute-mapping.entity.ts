import { Entity, JoinColumn, ManyToOne } from 'typeorm'
import CustomBase from './base'
import Category from './category.entity'
import CategoryAttribute from './category-attribute.entity'

@Entity()
class CategoryAttributeMapping extends CustomBase {
  @ManyToOne(() => Category, (category) => category.categoryAttributes)
  @JoinColumn({ name: 'category_id' })
  categoryAttribubeMapping: Category

  @ManyToOne(() => CategoryAttribute, (categoryAttribute) => categoryAttribute.attributeCategories)
  @JoinColumn({ name: 'attribute_id' })
  attributeCategoryMapping: CategoryAttribute
}

export default CategoryAttributeMapping

import { Column, Entity, OneToMany } from 'typeorm'
import CustomBase from './base'
import CategoryAttributeMapping from './category-attribute-mapping.entity'

@Entity()
class CategoryAttribute extends CustomBase {
  @Column({ unique: true, type: 'varchar', nullable: false })
  name: string

  @Column({ unique: true, type: 'varchar', nullable: false })
  attribute_name: string

  @OneToMany(() => CategoryAttributeMapping, (categoryAttributeMapping) => categoryAttributeMapping.attributeCategoryMapping)
  attributeCategories: CategoryAttribute[]
}

export default CategoryAttribute

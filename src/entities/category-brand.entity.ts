import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import CustomBase from './base'
import Category from './category.entity'
import Brand from './brand.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
@Index(['category_id', 'brand_id'], { unique: true })
class CategoryBrand extends CustomBase {
  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  category_id: string

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  brand_id: string

  @ManyToOne(() => Category, (category) => category.categoryBrands, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category

  @ManyToOne(() => Brand, (brand) => brand.brandCategories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brand_id'  })
  brand: Brand
}

export default CategoryBrand

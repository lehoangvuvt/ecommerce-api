import { Column, Entity, Index, OneToMany } from 'typeorm'
import CustomBase from './base'
import Product from './product.entity'
import CategoryBrand from './category-brand.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
class Keyword extends CustomBase {
  @ApiProperty()
  @Index()
  @Column({ unique: true, type: 'varchar', nullable: false })
  word: string
}

export default Keyword

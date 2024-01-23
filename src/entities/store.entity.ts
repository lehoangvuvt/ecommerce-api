import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import CustomBase from './base'
import Product from './product.entity'
import CategoryBrand from './category-brand.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
class Store extends BaseEntity{
  @ApiProperty()
  @PrimaryColumn({ type: 'int4' })
  id: number

  @ApiProperty()
  @Column({ type: 'timestamp with time zone', nullable: true })
  createdAt: Date

  @ApiProperty()
  @Column({ type: 'timestamp with time zone', nullable: true })
  updatedAt: Date

  @ApiProperty()
  @Column({ unique: true, type: 'varchar', nullable: false })
  url: string

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  name: string

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false, default: '' })
  avatar_url: string

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false, default: '' })
  background_url: string

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false, default: '' })
  banner_url: string

  @OneToMany(() => Product, (product) => product.store, { eager: true })
  products: Product[]

  @BeforeInsert()
  beforeInsert() {
    this.createdAt = new Date()
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = new Date()
  }
}

export default Store

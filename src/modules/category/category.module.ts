import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import Category from 'src/entities/category.entity'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'
import Attribute from 'src/entities/attribute.entity'
import AttributeValue from 'src/entities/attribute-value.entity'
import AttributeSetValueMapping from 'src/entities/attribute-set-value-mapping.entity'
import AttributeSet from 'src/entities/attribute-set.entity'
import CategoryBrand from 'src/entities/category-brand.entity'
import Brand from 'src/entities/brand.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryBrand, Brand, Attribute, AttributeValue, AttributeSet, AttributeSetValueMapping])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}

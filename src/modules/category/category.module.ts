import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import Category from 'src/entities/category.entity'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'
import CategoryAttribute from 'src/entities/category-attribute.entity'
import CategoryAttributeValue from 'src/entities/category-attribute-value.entity'
import CategoryAttributeMapping from 'src/entities/category-attribute-mapping.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryAttribute, CategoryAttributeValue, CategoryAttributeMapping])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}

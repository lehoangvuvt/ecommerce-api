import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import ProductAttribute from 'src/entities/product-attribute.entity'
import ProductAttributeValue from 'src/entities/product-attribute-value.entity'
import Product from 'src/entities/product.entity'
import ProductVariance from 'src/entities/product-variance.entity'
import Category from 'src/entities/category.entity'

@Module({
  controllers: [ProductController],
  imports: [TypeOrmModule.forFeature([Product, ProductAttribute, ProductAttributeValue, ProductVariance, Category])],
  providers: [ProductService],
})
export class ProductModule {}

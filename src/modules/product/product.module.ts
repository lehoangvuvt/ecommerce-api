import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import Product from 'src/entities/product.entity'
import ProductVariance from 'src/entities/product-variance.entity'
import Category from 'src/entities/category.entity'
import Attribute from 'src/entities/attribute.entity'
import AttributeValue from 'src/entities/attribute-value.entity'
import { AttributeService } from '../attribute/attribute.service'
import AttributeSet from 'src/entities/attribute-set.entity'
import AttributeSetValueMapping from 'src/entities/attribute-set-value-mapping.entity'
import ProductImage from 'src/entities/product-image.entity'
import ProductPriceHistory from 'src/entities/product-price-history.entity'
import ProductVarianceImage from 'src/entities/product-variance-image.entity'
import { CategoryService } from '../category/category.service'
import CategoryBrand from 'src/entities/category-brand.entity'
import Brand from 'src/entities/brand.entity'

@Module({
  controllers: [ProductController],
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductImage,
      ProductVarianceImage,
      ProductPriceHistory,
      Attribute,
      AttributeValue,
      AttributeSet,
      AttributeSetValueMapping,
      ProductVariance,
      Category,
      CategoryBrand,
      Brand,
    ]),
  ],
  providers: [ProductService, AttributeService, CategoryService],
})
export class ProductModule {}

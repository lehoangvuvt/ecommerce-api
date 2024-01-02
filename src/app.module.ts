import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import User from './entities/user.entity'
import { UserModule } from './modules/user/user.module'
import { ProductModule } from './modules/product/product.module'
import Product from './entities/product.entity'
import ProductAttribute from './entities/product-attribute.entity'
import ProductAttributeValue from './entities/product-attribute-value.entity'
import Category from './entities/category.entity'
import ProductVariance from './entities/product-variance.entity'
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'ecommerce',
      entities: [User, Product, ProductAttribute, ProductAttributeValue, Category, ProductVariance],
      synchronize: true,
    }),
    UserModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

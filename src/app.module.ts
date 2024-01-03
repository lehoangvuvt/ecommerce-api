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
import ProductImage from './entities/product-image.entity'
import ProductPriceHistory from './entities/product-price-history.entity'
import Cart from './entities/cart.entity'
import CartItem from './entities/cart-item.entity'
import UserShippingInfo from './entities/user-shipping-info.entity'
import UserInfo from './entities/user-info.entity'
import Order from './entities/order.entity'
import OrderItem from './entities/order-item.entity'
import Brand from './entities/brand.entity'
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
      entities: [
        User,
        UserInfo,
        UserShippingInfo,
        Order,
        OrderItem,
        Product,
        ProductAttribute,
        ProductAttributeValue,
        Brand,
        Category,
        ProductVariance,
        ProductImage,
        ProductPriceHistory,
        Cart,
        CartItem,
      ],
      synchronize: true,
    }),
    UserModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import User from './entities/user.entity'
import { UserModule } from './modules/user/user.module'
import { ProductModule } from './modules/product/product.module'
import Product from './entities/product.entity'
import Category from './entities/category.entity'
import ProductVariance from './entities/product-variance.entity'
import ProductPriceHistory from './entities/product-price-history.entity'
import Cart from './entities/cart.entity'
import CartItem from './entities/cart-item.entity'
import UserShippingInfo from './entities/user-shipping-info.entity'
import UserInfo from './entities/user-info.entity'
import Order from './entities/order.entity'
import OrderItem from './entities/order-item.entity'
import Brand from './entities/brand.entity'
import { CategoryModule } from './modules/category/category.module'
import ProductVarianceImage from './entities/product-variance-image.entity'
import ProductImage from './entities/product-image.entity'
import CategoryBrand from './entities/category-brand.entity'
import AttributeValue from './entities/attribute-value.entity'
import Attribute from './entities/attribute.entity'
import AttributeSet from './entities/attribute-set.entity'
import AttributeSetValueMapping from './entities/attribute-set-value-mapping.entity'
import { UploadedFilesModule } from './modules/upload-files/upload-files.module'
import { BrandModule } from './modules/brand/brand.module'
import { CategoryBrandModule } from './modules/category-brand/category-brand.module'
import { AttributeModule } from './modules/attribute/attribute.module'
import { DataSource } from 'typeorm'
import { AuthModule } from './modules/auth/auth.module'
import Checkout from './entities/checkout.entity'
import CheckoutItem from './entities/checkout-item.entity'
import Keyword from './entities/keyword.entity'
import { SearchModule } from './modules/search/search.module'
import SearchTerm from './entities/search-tearm.entity'
import Store from './entities/store.entity'
import { StoreModule } from './modules/store/store.module'
import { GeolocationModule } from './modules/geolocation/geolocation.module'
import OrderInfo from './entities/order-info.entity'
import { OrderModule } from './modules/order/order.module'
import { TrackingModule } from './modules/tracking/tracking.module'
import { SocketModule } from './socket/socket.module'
import ProductVarianceReview from './entities/product-variance-review.entity'
import ProductVarianceReviewImage from './entities/product-variance-review-image.entity'
import { MessageQueueModule } from './modules/message-queue/message-queue.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // host: 'roundhouse.proxy.rlwy.net',
      // port: 45858,
      // username: 'postgres',
      // password: '2gbdf3DDddGB1gD33dCGbf51C5dd63-f',
      // database: 'railway',
      entities: [
        User,
        UserInfo,
        UserShippingInfo,
        Order,
        OrderInfo,
        OrderItem,
        Attribute,
        AttributeValue,
        AttributeSet,
        AttributeSetValueMapping,
        Brand,
        Category,
        CategoryBrand,
        Product,
        ProductImage,
        ProductVariance,
        ProductVarianceImage,
        ProductPriceHistory,
        Cart,
        CartItem,
        Checkout,
        CheckoutItem,
        Keyword,
        SearchTerm,
        Store,
        ProductVarianceReview,
        ProductVarianceReviewImage,
      ],
      synchronize: true,
    }),
    UserModule,
    ProductModule,
    CategoryModule,
    UploadedFilesModule,
    BrandModule,
    CategoryBrandModule,
    AttributeModule,
    AuthModule,
    SearchModule,
    StoreModule,
    GeolocationModule,
    OrderModule,
    TrackingModule,
    SocketModule,
    MessageQueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [UserModule, MessageQueueModule],
})
export class AppModule {
  constructor(private datasource: DataSource) {}
}

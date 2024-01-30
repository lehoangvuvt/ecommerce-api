import { Module } from '@nestjs/common'
import { TrackingGateway } from './gateways/tracking.gateway'
import { JwtModule } from '@nestjs/jwt'
import { UserService } from 'src/modules/user/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import User from 'src/entities/user.entity'
import Cart from 'src/entities/cart.entity'
import CartItem from 'src/entities/cart-item.entity'
import Product from 'src/entities/product.entity'
import { TrackingService } from 'src/modules/tracking/tracking.service'
import { GeolocationService } from 'src/modules/geolocation/geolocation.service'
import { OrderService } from 'src/modules/order/order.service'
import Order from 'src/entities/order.entity'
import OrderItem from 'src/entities/order-item.entity'
import OrderInfo from 'src/entities/order-info.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, CartItem, Product, Order, OrderItem, OrderInfo]), JwtModule.register({})],
  controllers: [],
  providers: [TrackingGateway, TrackingService, UserService, GeolocationService, OrderService],
})
export class SocketModule {}

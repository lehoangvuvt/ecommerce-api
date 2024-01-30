import { Module } from '@nestjs/common'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import Order from 'src/entities/order.entity'
import OrderInfo from 'src/entities/order-info.entity'
import OrderItem from 'src/entities/order-item.entity'
import { JwtModule } from '@nestjs/jwt'
import { GeolocationService } from '../geolocation/geolocation.service'

@Module({
  controllers: [OrderController],
  imports: [TypeOrmModule.forFeature([Order, OrderInfo, OrderItem]), JwtModule.register({})],
  providers: [OrderService, GeolocationService],
})
export class OrderModule {}

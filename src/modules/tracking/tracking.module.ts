import { Module } from '@nestjs/common'
import { TrackingService } from './tracking.service'
import { TrackingController } from './tracking.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GeolocationService } from '../geolocation/geolocation.service'
import { OrderService } from '../order/order.service'
import Order from 'src/entities/order.entity'
import OrderItem from 'src/entities/order-item.entity'
import OrderInfo from 'src/entities/order-info.entity'

@Module({
  controllers: [TrackingController],
  imports: [TypeOrmModule.forFeature([Order, OrderItem, OrderInfo])],
  providers: [TrackingService, GeolocationService, OrderService],
})
export class TrackingModule {}

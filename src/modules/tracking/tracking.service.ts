import { Global, Inject, Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { DataSource, EntityManager } from 'typeorm'
import { GeolocationService } from '../geolocation/geolocation.service'
import { OrderService } from '../order/order.service'
import OrderInfo from 'src/entities/order-info.entity'
import { TSearchAddressToCoordsRes } from 'src/types/response.types'
@Injectable()
export class TrackingService {
  constructor(
    @Inject(GeolocationService) private geolocationService: GeolocationService,
    @Inject(OrderService) private orderService: OrderService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private datasource: DataSource
  ) {}

  async getTrackingData(orderId: string): Promise<TSearchAddressToCoordsRes> {
    const orderDetails = await this.orderService.getOrderDetails(orderId)
    const orderInfo = orderDetails['orderInfo'] as OrderInfo
    const { address, district, city, country } = orderInfo
    const fullAddressString = `${address}, district ${district}, ${city} city, ${country}`
    const coordinatesInfo = await this.geolocationService.getCoordsByAddress(fullAddressString)
    return coordinatesInfo
  }
}

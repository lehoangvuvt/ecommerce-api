import { Global, Inject, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { v4 as uuidv4 } from 'uuid'
import CreateOrderDTO from 'src/dtos/create-order.dto'
import OrderInfo from 'src/entities/order-info.entity'
import OrderItem from 'src/entities/order-item.entity'
import Order from 'src/entities/order.entity'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { GeolocationService } from '../geolocation/geolocation.service'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderInfo) private orderInfoRepository: Repository<OrderInfo>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @Inject(GeolocationService) private geolocationService: GeolocationService,
    private datasource: DataSource
  ) {}

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const orders = await this.orderRepository.find({ where: { user_id: userId } })
    return orders
  }

  async getOrderDetails(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } })
    const orderInfo = await this.orderInfoRepository.findOne({ where: { order_id: orderId } })
    order['orderInfo'] = orderInfo
    return order
  }

  async createOrder(createOrderDTO: CreateOrderDTO, userId: string) {
    await this.datasource.manager.transaction('SERIALIZABLE', async (transactionalEntityManager) => {
      const newOrder = this.orderRepository.create({ user_id: userId })
      const createNewOrderRes = await transactionalEntityManager.save(newOrder)
      const { address, city, country, district, firstName, items, lastName, phone } = createOrderDTO
      const fullAddress = `${address}, district ${district}, ${city} city, ${country}`
      const newOrderInfo = this.orderInfoRepository.create({
        order_id: createNewOrderRes.id,
        address,
        city,
        country,
        district,
        firstName,
        lastName,
        phone,
      })
      const createOrderInfoRes = await transactionalEntityManager.save(newOrderInfo)

      const createOrderItems = items.map(async (item) => {
        const newOrderItem = this.orderItemRepository.create({
          order_id: createNewOrderRes.id,
          quantity: item.quantity,
          product_variance_id: item.product_variance_id,
        })
        await transactionalEntityManager.save(newOrderItem)
      })

      await Promise.all(createOrderItems)
    })
  }
}

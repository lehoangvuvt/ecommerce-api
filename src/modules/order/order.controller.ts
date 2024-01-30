import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common'
import { OrderService } from './order.service'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response, Request } from 'express'
import CreateOrderDTO from 'src/dtos/create-order.dto'
import { TokenVerifyGuard } from '../auth/tokenVerify.guard'
import Order from 'src/entities/order.entity'

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @ApiResponse({ status: 200, type: [Order] })
  @UseGuards(TokenVerifyGuard)
  @Get('')
  async getOrdersByUserId(@Req() req: any, @Res() res: Response) {
    const userId = req.id
    const response = await this.service.getOrdersByUserId(userId)
    return res.status(200).json(response)
  }

  @ApiResponse({ status: 200, type: Order })
  @Get(`order-details/:orderId`)
  async getOderDetails(@Param() params: { orderId: string }, @Res() res: Response) {
    const response = await this.service.getOrderDetails(params.orderId)
    return res.status(200).json(response)
  }

  @UseGuards(TokenVerifyGuard)
  @ApiBody({ type: CreateOrderDTO })
  @Post('')
  async createOrder(@Body() createOrderDTO: CreateOrderDTO, @Req() req: any, @Res() res: Response) {
    const userId = req.id
    const response = await this.service.createOrder(createOrderDTO, userId)
  }
}

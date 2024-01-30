import { Controller, Get, Param, Res } from '@nestjs/common'
import { TrackingService } from './tracking.service'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

@ApiTags('Tracking')
@Controller('tracking')
export class TrackingController {
  constructor(private readonly service: TrackingService) {}

  @Get('order/:orderId')
  async getOrderTrackingInfo(@Param() params: { orderId: string }, @Res() res: Response) {
    const response = await this.service.getTrackingData(params.orderId)
    return res.status(200).json(response)
  }
}

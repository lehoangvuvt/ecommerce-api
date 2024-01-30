import { Controller, Get, Param, Res } from '@nestjs/common'
import { GeolocationService } from './geolocation.service'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

@ApiTags('Geolocation')
@Controller('geolocation')
export class GeolocationController {
  constructor(private readonly service: GeolocationService) {}

  @Get('reverse-geocoding/lat=:lat&lon=:lon')
  async reverseGeocoding(@Param() params: { lat: number; lon: number }, @Res() res: Response) {
    const response = await this.service.reverseGeocoding(params.lat, params.lon)
    return res.status(200).json(response)
  }

  @Get('search/q=:q')
  async getCoordsByAddress(@Param() params: { q: string }, @Res() res: Response) {
    console.log(true)
    const response = await this.service.getCoordsByAddress(params.q)
    return res.status(200).json(response)
  }
}

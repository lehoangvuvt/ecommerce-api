import { Module } from '@nestjs/common'
import { GeolocationService } from './geolocation.service'
import { GeolocationController } from './geolocation.controller'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  controllers: [GeolocationController],
  imports: [TypeOrmModule.forFeature([])],
  providers: [GeolocationService],
})
export class GeolocationModule {}

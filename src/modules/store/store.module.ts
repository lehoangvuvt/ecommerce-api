import { Module } from '@nestjs/common'
import { StoreService } from './store.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StoreController } from './store.controller'
import Store from 'src/entities/store.entity'

@Module({
  controllers: [StoreController],
  imports: [TypeOrmModule.forFeature([Store])],
  providers: [StoreService],
})
export class StoreModule {}

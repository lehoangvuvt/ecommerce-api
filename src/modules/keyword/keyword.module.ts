import { Module } from '@nestjs/common'
import { KeywordService } from './keyword.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import Keyword from 'src/entities/keyword.entity'
import { KeywordController } from './keyword.controller'

@Module({
  controllers: [KeywordController],
  imports: [TypeOrmModule.forFeature([Keyword])],
  providers: [KeywordService],
})
export class KeywordModule {}

import { Module } from '@nestjs/common'
import { SearchService } from './search.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import Keyword from 'src/entities/keyword.entity'
import { SearchController } from './search.controller'
import SearchTerm from 'src/entities/search-tearm.entity'

@Module({
  controllers: [SearchController],
  imports: [TypeOrmModule.forFeature([Keyword, SearchTerm])],
  providers: [SearchService],
})
export class SearchModule {}

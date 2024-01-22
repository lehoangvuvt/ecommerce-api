import { Global, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { DataSource, EntityManager, Repository } from 'typeorm'
import Keyword from 'src/entities/keyword.entity'
import { v4 as uuidv4 } from 'uuid'

@Global()
@Injectable()
export class KeywordService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Keyword) private keywordRepository: Repository<Keyword>,
    private datasource: DataSource
  ) {}

  async insertWords(document: string) {
    try {
      const wordsArr = document.split(' ')
        .map((item) => ({ word: item.split(':')[0]
        .replaceAll(`'`, '')
        .toLowerCase(), id: uuidv4(), createdAt: new Date() }))
      const response = await this.datasource.createQueryBuilder()
        .insert()
        .into(Keyword)
        .values(wordsArr)
        .orIgnore()
        .execute()
      return response
    } catch (error) {
      return null
    }
  }
}

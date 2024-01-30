import { Global, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { DataSource, EntityManager, Repository } from 'typeorm'
import Keyword from 'src/entities/keyword.entity'
import { v4 as uuidv4 } from 'uuid'
import SearchTerm from 'src/entities/search-tearm.entity'
@Injectable()
export class SearchService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Keyword) private keywordRepository: Repository<Keyword>,
    @InjectRepository(SearchTerm) private searchTermRepository: Repository<SearchTerm>,
    private datasource: DataSource
  ) {}

  async insertWords(document: string) {
    try {
      const wordsArr = document.split(' ').map((item) => ({ word: item.split(':')[0].replaceAll(`'`, '').toLowerCase(), id: uuidv4(), createdAt: new Date() }))
      const response = await this.datasource.createQueryBuilder().insert().into(Keyword).values(wordsArr).orIgnore().execute()
      return response
    } catch (error) {
      return null
    }
  }

  async insertSearchTerm(term: string) {
    const existedSearchTerm = await this.searchTermRepository.findOne({ where: { term } })
    if (!existedSearchTerm) {
      const searchTerm = this.searchTermRepository.create({
        term,
        count: 1,
      })
      await searchTerm.save()
    } else {
      existedSearchTerm.count += 1
      await existedSearchTerm.save()
    }
  }

  async getSuggestedSearchTerms(term: string): Promise<SearchTerm[]> {
    const suggestedTerms = await this.searchTermRepository
      .createQueryBuilder('search_term')
      .select('search_term')
      .addSelect(
        `((GREATEST (length(term),length('${term}')) - levenshtein("search_term"."term", '${term}')) / GREATEST (length(term),length('${term}'))::decimal)`
      )
      .where(
        `((GREATEST (length(term),length('${term}')) - levenshtein("search_term"."term", '${term}')) / GREATEST (length(term),length('${term}'))::decimal) >= 0.5`
      )
      .addOrderBy(
        `((GREATEST (length(term),length('${term}')) - levenshtein("search_term"."term", '${term}')) / GREATEST (length(term),length('${term}'))::decimal)`,
        'DESC'
      )
      .getMany()
    return suggestedTerms
  }

  async getFixedKeyword(keyword: string): Promise<string> {
    const keywordArr = keyword.toLowerCase().trim().split(' ')
    let fixedKeyword = ''
    const getFixedKeyword = keywordArr.map(async (kWord) => {
      const fixedWord = await this.keywordRepository
        .createQueryBuilder('keyword')
        .select('keyword')
        .addSelect(
          `((GREATEST (length(word),length('${kWord}')) - levenshtein("keyword"."word", '${kWord}')) / GREATEST (length(word),length('${kWord}'))::decimal)`
        )
        .where(
          `((GREATEST (length(word),length('${kWord}')) - levenshtein("keyword"."word", '${kWord}')) / GREATEST (length(word),length('${kWord}'))::decimal) >= 0.65`
        )
        .orderBy(
          `((GREATEST (length(word),length('${kWord}')) - levenshtein("keyword"."word", '${kWord}')) / GREATEST (length(word),length('${kWord}'))::decimal)`,
          'DESC'
        )
        .getOne()
      if (fixedWord) {
        fixedKeyword += `${fixedWord.word} `
      }
    })

    await Promise.all(getFixedKeyword)

    const keywordWords = keyword.trim().toUpperCase().split(' ')
    const fixedKeywordWords = fixedKeyword.trim().toUpperCase().split(' ')
    let matchWordsCount = 0
    fixedKeywordWords.forEach((fixWord) => {
      if (keywordWords.includes(fixWord)) {
        matchWordsCount++
      }
    })

    if (fixedKeyword.trim().length === 0 || matchWordsCount === fixedKeywordWords.length) return null

    return fixedKeyword.trim()
  }

  async getPopularSearchTerms(): Promise<SearchTerm[]> {
    const result = await this.searchTermRepository.find({ order: { count: 'DESC' }, take: 10 })
    return result
  }
}

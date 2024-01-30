import { Global, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { DataSource, EntityManager, Repository } from 'typeorm'
import Store from 'src/entities/store.entity'
import CreateStoreDTO from 'src/dtos/create-store.dto'
import ProductVarianceReview from 'src/entities/product-variance-review.entity'

@Injectable()
export class StoreService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Store) private storeRepository: Repository<Store>,
    private datasource: DataSource
  ) {}

  async getStoreDetails(url: string): Promise<Store> {
    const store = await this.storeRepository.findOne({ where: { url } })
    delete store.products
    store['overview'] = await this.getStoreOverview(store.id)
    return store
  }

  async getStoreOverview(storeId: number): Promise<Store> {
    const store = await this.storeRepository.findOne({ where: { id: storeId } })
    store['total_products_count'] = store.products.length
    const categoryTabs: { slug: string; name: string }[] = []
    store.products.forEach((product) => {
      const slug = product.category.slug
      const name = product.category.category_name
      const index = categoryTabs.findIndex((category) => category.slug === slug)
      if (index !== -1) return
      categoryTabs.push({ name, slug })
    })
    store['category_tabs'] = categoryTabs
    const storeReviewStars = (await this.datasource.query(`
        select pr.star from store st
        INNER JOIN product pd
        ON st.id = pd.store_id
        INNER JOIN product_variance pv
        ON pd.id = pv.product_id
        INNER JOIN product_variance_review pr
        ON pr.product_variance_id = pv.id
        WHERE st.id=${store.id}
    `)) as { star: number }[]
    store['average_rating'] =
      storeReviewStars.length > 0 ? parseFloat((storeReviewStars.reduce((prev, curr) => prev + curr.star, 0) / storeReviewStars.length).toFixed(1)) : 0
    store['total_ratings_count'] = storeReviewStars.length
    store['total_followers_count'] = 120
    delete store.products
    return store
  }

  async createStore(createStoreDTO: CreateStoreDTO): Promise<Store> {
    try {
      const { avatar_url, background_url, banner_url, name, url } = createStoreDTO
      let isDuplicated = false
      let randomId = 0
      do {
        randomId = Math.floor(1000000000 + Math.random() * 2000000000)
        const foundStore = await this.storeRepository.findOne({ where: { id: randomId } })
        if (foundStore) {
          isDuplicated = true
        } else {
          isDuplicated = false
        }
      } while (isDuplicated)
      const newStore = this.storeRepository.create({
        id: randomId,
        url,
        avatar_url,
        background_url,
        banner_url,
        name,
      })
      const result = await newStore.save()
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

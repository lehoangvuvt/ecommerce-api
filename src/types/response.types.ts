import { ApiProperty } from '@nestjs/swagger'
import Category from 'src/entities/category.entity'

class CategoryWithChild {
  @ApiProperty({ type: Category })
  info: Category

  @ApiProperty({ type: () => [CategoryWithChild] })
  child: CategoryWithChild[]
}

export type TPagingListResponse<T> = {
  total: number
  has_next: boolean
  current_page: number
  total_page: number
  data: T[]
}

export type TSearchAddressToCoordsRes = {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: string
  lon: string
  category: string
  type: string
  place_rank: number
  importance: number
  addresstype: string
  name: string
  display_name: string
  boundingbox: string[]
  geojson: {
    type: string
    coordinates: Record<number, number>
  }
}

export type TProductReview = {
  id: string
  createdAt: Date
  updatedAt: Date
  product_variance_id: string
  user_id: string
  star: number
  comment: string
  variance_values: string[]
  username: string
}

export { CategoryWithChild }

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

export { CategoryWithChild }

import { ApiProperty } from '@nestjs/swagger'
import Category from 'src/entities/category.entity'

class CategoryWithChild {
  @ApiProperty({ type: Category })
  info: Category

  @ApiProperty({ type: () => [CategoryWithChild]})
  child: CategoryWithChild[]
}

export { CategoryWithChild }

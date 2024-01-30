import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator'

export default class CreateProductVarianceReviewDTO {
  @ApiProperty({ type: String, description: 'Id of product variance', required: true })
  @IsString()
  @IsNotEmpty()
  product_variance_id: string

  @ApiProperty({ type: String, description: 'Comment for product variance review', required: true })
  @IsString()
  @IsNotEmpty()
  comment: string

  @ApiProperty({ type: Number, description: 'Star rating for product variance. Max value is 5, min is 1', required: true })
  @IsNumber()
  @Max(5)
  @Min(1)
  star: number

  @ApiProperty({ type: String, description: 'Images of product variance review, not required', required: false, isArray: true })
  @IsArray()
  images?: string[]
}

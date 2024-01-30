import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import CustomBase from './base'
import ProductVarianceReview from './product-variance-review.entity'

@Entity()
class ProductVarianceReviewImage extends CustomBase {
  @Column({ type: 'varchar', nullable: false })
  product_variance_review_id: string

  @Column({ type: 'varchar', nullable: false })
  image_url : string

  @ManyToOne(() => ProductVarianceReview, (productVarianceReview) => productVarianceReview.images)
  @JoinColumn({ name: 'product_variance_review_id'})
  productVarianceReview: ProductVarianceReview
}

export default ProductVarianceReviewImage

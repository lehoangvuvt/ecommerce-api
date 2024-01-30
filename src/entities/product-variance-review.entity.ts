import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import CustomBase from './base'
import User from './user.entity'
import Product from './product.entity'
import ProductReviewImage from './product-variance-review-image.entity'
import ProductVariance from './product-variance.entity'

@Entity()
class ProductVarianceReview extends CustomBase {
  @Column({ type: 'varchar', nullable: false })
  product_variance_id: string

  @Column({ type: 'varchar', nullable: false })
  user_id: string

  @Column({ type: 'int', default: 0 })
  star: number

  @Column({ type: 'varchar', nullable: false })
  comment: string

  @ManyToOne(() => User, (user) => user.productVarianceReviews)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => ProductVariance, (productVariance) => productVariance.productVarianceReviews)
  @JoinColumn({ name: 'product_variance_id' })
  productVariance: ProductVariance

  @OneToMany(() => ProductReviewImage, (productReviewImage) => productReviewImage.productVarianceReview, { eager: true })
  images: ProductReviewImage[]
}

export default ProductVarianceReview

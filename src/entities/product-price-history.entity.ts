import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import CustomBase from './base'
import ProductVariance from './product-variance.entity'

@Entity()
class ProductPriceHistory extends CustomBase {
  @Column({ type: 'decimal', precision: 2, width: 10, nullable: false })
  price: string

  @ManyToOne(() => ProductVariance, (productVariance) => productVariance.productPriceHistories)
  @JoinColumn({ name: 'product_variance_id' })
  productVariance: ProductVariance
}

export default ProductPriceHistory

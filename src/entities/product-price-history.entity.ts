import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import CustomBase from './base'
import ProductVariance from './product-variance.entity'

@Entity()
class ProductPriceHistory extends CustomBase {
  @Column({ type: 'varchar', nullable: false })
  product_variance_id: string

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number

  @ManyToOne(() => ProductVariance, (productVariance) => productVariance.productPriceHistories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_variance_id' })
  productVariance: ProductVariance
}

export default ProductPriceHistory

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import CustomBase from './base'
import ProductVariance from './product-variance.entity'

@Entity()
class ProductVarianceImage extends CustomBase {
  @Column({ type: 'varchar', nullable: false })
  image_url: string

  @Column({ type: 'varchar', nullable: false })
  image_type: string

  @Column({ type: 'varchar', nullable: false })
  product_variance_id: string

  @ManyToOne(() => ProductVariance, (productVariance) => productVariance.productVarianceImages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_variance_id' })
  productVariance: ProductVariance
}

export default ProductVarianceImage

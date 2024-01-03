import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import CustomBase from './base'
import ProductVariance from './product-variance.entity'

@Entity()
class ProductImage extends CustomBase {
  @Column({ type: 'varchar', nullable: false })
  image_url: string

  @Column({ type: 'varchar', nullable: false })
  image_type: string

  @ManyToOne(() => ProductVariance, (productVariance) => productVariance.productImages)
  @JoinColumn({ name: 'product_variance_id' })
  productVariance: ProductVariance
}

export default ProductImage

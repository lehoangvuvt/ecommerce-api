import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import CustomBase from './base'
import Product from './product.entity'

@Entity()
class ProductImage extends CustomBase {
  @Column({ type: 'varchar', nullable: false })
  image_url: string

  @Column({ type: 'varchar', nullable: false })
  image_type: string

  @Column({ type: 'varchar', nullable: false })
  product_id: string

  @ManyToOne(() => Product, (product) => product.images)
  @JoinColumn({ name: 'product_id' })
  product: Product
}

export default ProductImage

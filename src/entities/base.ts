import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

@Entity()
class CustomBase extends BaseEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string

  @Column({ type: 'timestamp with time zone', nullable: true })
  createdAt: Date

  @Column({ type: 'timestamp with time zone', nullable: true })
  updatedAt: Date

  @BeforeInsert()
  beforeInsert() {
    this.id = uuidv4()
    this.createdAt = new Date()
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = new Date()
  }
}

export default CustomBase

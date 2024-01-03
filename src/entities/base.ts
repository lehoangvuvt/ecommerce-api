import { ApiProperty } from '@nestjs/swagger'
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

@Entity()
class CustomBase extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn({ type: 'varchar' })
  id: string

  @ApiProperty()
  @Column({ type: 'timestamp with time zone', nullable: true })
  createdAt: Date

  @ApiProperty()
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

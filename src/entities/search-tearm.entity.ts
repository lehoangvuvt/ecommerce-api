import { Column, Entity, Index } from 'typeorm'
import CustomBase from './base'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
class SearchTerm extends CustomBase {
  @ApiProperty()
  @Index()
  @Column({ unique: true, type: 'varchar', nullable: false })
  term: string

  @ApiProperty()
  @Column({ type: 'int2', default: 1 })
  count: number
}

export default SearchTerm

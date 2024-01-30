import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AttributeController } from './attribute.controller'
import { AttributeService } from './attribute.service'
import Attribute from 'src/entities/attribute.entity'
import AttributeValue from 'src/entities/attribute-value.entity'
import AttributeSetValueMapping from 'src/entities/attribute-set-value-mapping.entity'
import AttributeSet from 'src/entities/attribute-set.entity'
@Module({
  imports: [TypeOrmModule.forFeature([Attribute, AttributeSet, AttributeValue, AttributeSetValueMapping])],
  controllers: [AttributeController],
  providers: [AttributeService],
})
export class AttributeModule {}

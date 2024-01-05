import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import CreateAttributeSetValueMappingDTO from 'src/dtos/create-attribute-set-value-mapping.dto'
import CreateAttributeSetDTO from 'src/dtos/create-attribute-set.dto'
import CreateAttributeValueDTO from 'src/dtos/create-attribute-value.dto'
import CreateAttributeDTO from 'src/dtos/create-attribute.dto'
import AttributeSetValueMapping from 'src/entities/attribute-set-value-mapping.entity'
import AttributeSet from 'src/entities/attribute-set.entity'
import AttributeValue from 'src/entities/attribute-value.entity'
import Attribute from 'src/entities/attribute.entity'
import Category from 'src/entities/category.entity'
import { Repository } from 'typeorm'

@Injectable()
export class AttributeService {
  constructor(
    @InjectRepository(Attribute) private attributeRepository: Repository<Attribute>,
    @InjectRepository(AttributeValue) private attributeValueRepository: Repository<AttributeValue>,
    @InjectRepository(AttributeSet) private attributeSetRepository: Repository<AttributeSet>,
    @InjectRepository(AttributeSetValueMapping) private attributeSetValueMappingRepository: Repository<AttributeSetValueMapping>,
    ) {}

  async createAttribute(createAttributeDTO: CreateAttributeDTO) {
    try {
      const newAttribute = this.attributeRepository.create({
        attribute_name: createAttributeDTO.attribute_name,
        value_type: createAttributeDTO.value_type,
      })
      const result = await newAttribute.save()
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async createAttributeSet(): Promise<AttributeSet> {
    try {
      const newAttributeSet = this.attributeSetRepository.create()
      const result = await newAttributeSet.save()
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async createAttributeValue(createAttributeValueDTO: CreateAttributeValueDTO): Promise<AttributeValue> {
    try {
      const { attribute_id, value_decimal, value_int, value_string } = createAttributeValueDTO
      const attribute = await this.attributeRepository.findOne({ where: { id: attribute_id } })
      if (!attribute) return null
      const attributeValueType = attribute.value_type
      let newAttributeValue: AttributeValue = null
      switch (attributeValueType) {
        case 0:
          newAttributeValue = this.attributeValueRepository.create({
            attribute_id: attribute_id,
            value_decimal,
          })
          break
        case 1:
          newAttributeValue = this.attributeValueRepository.create({
            attribute_id: attribute_id,
            value_int,
          })
          break
        case 2:
          newAttributeValue = this.attributeValueRepository.create({
            attribute_id: attribute_id,
            value_string,
          })
          break
      }
      const result = await newAttributeValue.save()
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async createAttributeSetValueMapping(createAttributeSetValueMappingDTO: CreateAttributeSetValueMappingDTO) {
    try {
      const { attribute_set_id, attribute_value_id } = createAttributeSetValueMappingDTO
      const newAttributeSetValueMapping = this.attributeSetValueMappingRepository.create({
        attribute_set_id,
        attribute_value_id,
      })
      const result = await newAttributeSetValueMapping.save()
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

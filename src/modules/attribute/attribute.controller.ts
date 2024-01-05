import { Body, Controller, Post, Res } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { AttributeService } from './attribute.service'
import CreateAttributeDTO from 'src/dtos/create-attribute.dto'
import { Response } from 'express'
import Attribute from 'src/entities/attribute.entity'
import AttributeSet from 'src/entities/attribute-set.entity'
import CreateAttributeValueDTO from 'src/dtos/create-attribute-value.dto'
import AttributeValue from 'src/entities/attribute-value.entity'
import AttributeSetValueMapping from 'src/entities/attribute-set-value-mapping.entity'
import CreateAttributeSetValueMappingDTO from 'src/dtos/create-attribute-set-value-mapping.dto'
@ApiTags('Attribute')
@Controller('attribute')
export class AttributeController {
  constructor(private readonly service: AttributeService) {}

  @ApiBody({ type: CreateAttributeDTO })
  @ApiCreatedResponse({ description: 'The record has been successfully created.', type: Attribute })
  @Post('/attribute')
  async createAttribute(@Body() createAttributeDTO: CreateAttributeDTO, @Res() res: Response) {
    const response = await this.service.createAttribute(createAttributeDTO)
    if (!response) return res.status(400).json({ error: 'Something error' })
    return res.status(201).json(response)
  }

  @ApiCreatedResponse({ description: 'The record has been successfully created.', type: AttributeSet })
  @Post('/attribute-set')
  async createAttributeSet(@Res() res: Response) {
    const response = await this.service.createAttributeSet()
    if (!response) return res.status(404).json({ error: 'Something error' })
    return res.status(201).json(response)
  }

  @ApiBody({ type: CreateAttributeValueDTO })
  @ApiCreatedResponse({ description: 'The record has been successfully created.', type: AttributeValue })
  @Post('/attribute-value')
  async createAttributeValue(@Body() createAttributeValueDTO: CreateAttributeValueDTO, @Res() res: Response) {
    const response = await this.service.createAttributeValue(createAttributeValueDTO)
    if (!response) return res.status(404).json({ error: 'Something error' })
    return res.status(201).json(response)
  }

  @ApiBody({ type: CreateAttributeSetValueMappingDTO })
  @ApiCreatedResponse({ description: 'The record has been successfully created.', type: AttributeSetValueMapping })
  @Post('/value-to-set')
  async createAttributeSetValueMapping(@Body() createAttributeSetValueMappingDTO: CreateAttributeSetValueMappingDTO, @Res() res: Response) {
    const response = await this.service.createAttributeSetValueMapping(createAttributeSetValueMappingDTO)
    if (!response) return res.status(404).json({ error: 'Something error' })
    return res.status(201).json(response)
  }
}

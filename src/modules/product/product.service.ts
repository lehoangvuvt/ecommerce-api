import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import CreateProductDTO from 'src/dtos/create-product.dto'
import AttributeSet from 'src/entities/attribute-set.entity'
import Attribute from 'src/entities/attribute.entity'
import Category from 'src/entities/category.entity'
import Product from 'src/entities/product.entity'
import { Repository } from 'typeorm'
import { AttributeService } from '../attribute/attribute.service'
import ProductVariance from 'src/entities/product-variance.entity'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(ProductVariance) private productVarianceRepository: Repository<ProductVariance>,
    @Inject(AttributeService) private attributeService: AttributeService
  ) {}

  async getAllProducts() {
    const result = await this.productRepository.find()
    return result
  }

  async getProductDetails(id: string): Promise<Product> {
    const result = await this.productRepository.findOne({ where: { id } })
    if (!result) return null
    const variances = await this.productVarianceRepository.find({ where: { product_id: result.id } })
    let productVariance: {
      [key: string]: {
        [key: string]: {
          qty: number
          price: number
          imageURL: string
        }
      }
    } = {}
    variances.forEach((variance) => {
      const mainAttrValue = variance.attributeSet.attributeSetValueMappings[0].attributeValue.value_string
      const subAttrValue = variance.attributeSet.attributeSetValueMappings[1].attributeValue.value_string
      productVariance[mainAttrValue] = {
        [subAttrValue]: {
          qty: variance.quantity,
          price: 1000,
          imageURL: variance.productVarianceImages[0] ? variance.productVarianceImages[0].image_url : '',
        },
      }
    })
    result['productVariance'] = productVariance
    return result
  }

  async createProduct(createProductDTO: CreateProductDTO): Promise<Product> {
    const { brand_id, category_id, description, productAttributes, productVariances, product_name } = createProductDTO

    let productAtrributeValueIds: string[] = []

    const createProductAttributeValues = Object.keys(productAttributes).map(async (key: string, index: number) => {
      const attribute_id = key
      const value = productAttributes[key]
      const attributeValue = await this.attributeService.createAttributeValue({ attribute_id, value })
      productAtrributeValueIds.push(attributeValue.id)
    })
    await Promise.all(createProductAttributeValues)

    const productAttributeSet = await this.attributeService.createAttributeSet()

    const createAttributeSetValueMappings = productAtrributeValueIds.map(async (attributeValueId) => {
      await this.attributeService.createAttributeSetValueMapping({
        attribute_set_id: productAttributeSet.id,
        attribute_value_id: attributeValueId,
      })
    })
    await Promise.all(createAttributeSetValueMappings)

    const newProduct = this.productRepository.create({
      brand_id,
      category_id,
      description,
      product_name,
      attribute_set_id: productAttributeSet.id,
    })
    const createProductRes = await newProduct.save()

    const productVarianceMainAttibute = await this.attributeService.createAttribute({
      attribute_name: productVariances[0].mainAttribute.name,
      value_type: 2,
      is_primary: true,
    })

    const productVarianceSubAttibute = await this.attributeService.createAttribute({
      attribute_name: productVariances[0].subAttribute.name,
      value_type: 2,
      is_primary: false,
    })

    productVariances.map(async (variance) => {
      const { imageURL, mainAttribute, subAttribute } = variance
      const { value: mainAttributeValue } = mainAttribute
      const { values: subAttributeValues } = subAttribute
      subAttributeValues.map(async (subAttribute) => {
        const main_attribute_id = productVarianceMainAttibute.id
        const sub_attribute_id = productVarianceSubAttibute.id
        const createMainAttributeValueRes = await this.attributeService.createAttributeValue({ attribute_id: main_attribute_id, value: mainAttributeValue })
        const createSubAttributeValueRes = await this.attributeService.createAttributeValue({ attribute_id: sub_attribute_id, value: subAttribute.value })
        const attributeSet = await this.attributeService.createAttributeSet()
        const createMainAttributeSetValueMappingRes = await this.attributeService.createAttributeSetValueMapping({
          attribute_set_id: attributeSet.id,
          attribute_value_id: createMainAttributeValueRes.id,
        })
        const createSubAttributeSetValueMappingRes = await this.attributeService.createAttributeSetValueMapping({
          attribute_set_id: attributeSet.id,
          attribute_value_id: createSubAttributeValueRes.id,
        })
        const newProductVariance = this.productVarianceRepository.create({
          attribute_set_id: attributeSet.id,
          quantity: subAttribute.quantity,
          product_id: createProductRes.id,
        })
        const createProductVarianceRes = await newProductVariance.save()
      })
    })
    return createProductRes
  }
}

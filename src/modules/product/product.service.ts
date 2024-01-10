import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import CreateProductDTO from 'src/dtos/create-product.dto'
import AttributeSet from 'src/entities/attribute-set.entity'
import Attribute from 'src/entities/attribute.entity'
import Category from 'src/entities/category.entity'
import Product from 'src/entities/product.entity'
import { EntityManager, Repository, getManager } from 'typeorm'
import { AttributeService } from '../attribute/attribute.service'
import ProductVariance from 'src/entities/product-variance.entity'
import ProductImage from 'src/entities/product-image.entity'
import ProductPriceHistory from 'src/entities/product-price-history.entity'
import ProductVarianceImage from 'src/entities/product-variance-image.entity'
import { slugGenerator } from 'src/utils/utils'
import { CategoryService } from '../category/category.service'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(ProductVariance) private productVarianceRepository: Repository<ProductVariance>,
    @InjectRepository(ProductImage) private productImageRepository: Repository<ProductImage>,
    @InjectRepository(ProductVarianceImage) private productVarianceImageRepository: Repository<ProductVarianceImage>,
    @InjectRepository(ProductPriceHistory) private productPriceHistoryRepository: Repository<ProductPriceHistory>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    @Inject(AttributeService) private attributeService: AttributeService,
    @Inject(CategoryService) private categoryService: CategoryService
  ) {}

  async getAllProducts() {
    const result = await this.productRepository.find()
    return result
  }

  async getProductDetails(slug: string): Promise<Product> {
    const result = await this.productRepository.findOne({ where: { slug } })
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
      const price = variance.productPriceHistories.sort((a, b) => b.price - a.price)[0].price
      const qty = variance.quantity
      const attribute1 = variance.attributeSet.attributeSetValueMappings[0].attributeValue
      const attribute2 = variance.attributeSet.attributeSetValueMappings[1].attributeValue
      if (attribute1.attribute.is_primary) {
        productVariance[`${attribute1.value_string}:${attribute1.attribute.attribute_name}`] = {
          ...productVariance[`${attribute1.value_string}:${attribute1.attribute.attribute_name}`],
          [`${attribute2.value_string}:${attribute2.attribute.attribute_name}`]: {
            price,
            qty,
            imageURL: variance.productVarianceImages[0] ? variance.productVarianceImages[0].image_url : '',
          },
        }
      } else {
        productVariance[`${attribute2.value_string}:${attribute2.attribute.attribute_name}`] = {
          ...productVariance[`${attribute2.value_string}:${attribute2.attribute.attribute_name}`],
          [`${attribute1.value_string}:${attribute1.attribute.attribute_name}`]: {
            qty,
            price,
            imageURL: variance.productVarianceImages[0] ? variance.productVarianceImages[0].image_url : '',
          },
        }
      }
    })
    result['product_variance'] = productVariance
    const categoryPath = await this.categoryService.getCategoryPath(result.category_id)
    result['category_path'] = categoryPath
    return result
  }

  async createProduct(createProductDTO: CreateProductDTO): Promise<Product> {
    const { brand_id, category_id, description, productAttributes, productVariances, product_name, images } = createProductDTO

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

    const productImages: ProductImage[] = []
    const newProduct = this.productRepository.create({
      brand_id,
      category_id,
      description,
      product_name,
      attribute_set_id: productAttributeSet.id,
      slug: slugGenerator(product_name),
    })
    const createProductRes = await newProduct.save()

    if (images.length > 0) {
      const createProductImages = images.map(async (imgURL) => {
        const newImage = this.productImageRepository.create({
          image_type: 'png',
          image_url: imgURL,
          product_id: createProductRes.id,
        })
        const newImageRes = await newImage.save()
        productImages.push(newImageRes)
      })
      await Promise.all(createProductImages)
    }

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
        const newProductPriceHistory = this.productPriceHistoryRepository.create({
          product_variance_id: createProductVarianceRes.id,
          price: subAttribute.price,
        })
        const createProductPriceHistoryRes = await newProductPriceHistory.save()
        const newProductVarianceImage = this.productVarianceImageRepository.create({
          product_variance_id: createProductVarianceRes.id,
          image_url: variance.imageURL,
          image_type: 'png',
        })
        const createProductVarianceImageRes = await newProductVarianceImage.save()
      })
    })
    return createProductRes
  }

  async searchProducts(searchParams: string): Promise<Product[]> {
    let query: { [key: string]: string[] } = {}

    searchParams.split('&').forEach((item) => {
      query[item.split('=')[0]] = item.split('=')[1].split(',')
    })

    let baseQuery = this.productRepository.createQueryBuilder('product').select('product').leftJoinAndSelect('product.images', 'images')

    let whereQueries = ''

    if (query['c']) {
      baseQuery.leftJoin('category', 'category', 'category.id=product.category_id')
      let inQuery = '('
      query['c'].forEach((value) => {
        inQuery += `'${value}',`
      })
      inQuery = inQuery.substring(0, inQuery.length - 1)
      inQuery += ')'
      if (whereQueries.length === 0) {
        whereQueries += `category.slug IN ${inQuery} `
      } else {
        whereQueries += `AND category.slug IN ${inQuery} `
      }
      delete query['c']
    }

    if (query['b']) {
      baseQuery.leftJoin('brand', 'brand', 'brand.id=product.brand_id')
      let inQuery = '('
      query['b'].forEach((value) => {
        inQuery += `'${value}',`
      })
      inQuery = inQuery.substring(0, inQuery.length - 1)
      inQuery += ')'
      if (whereQueries.length === 0) {
        whereQueries += `brand.brand_name IN ${inQuery} `
      } else {
        whereQueries += `AND brand.brand_name IN ${inQuery} `
      }
      delete query['b']
    }

    if (Object.keys(query).some((key) => key.includes('attribute_'))) {
      baseQuery
        .leftJoin('attribute_set_value_mapping', 'attribute_set_value_mapping', 'attribute_set_value_mapping.attribute_set_id=product.attribute_set_id')
        .leftJoin('attribute_value', 'attribute_value', 'attribute_value.id=attribute_set_value_mapping.attribute_value_id')
        .leftJoin('attribute', 'attribute', 'attribute.id=attribute_value.attribute_id')
      for (let key in query) {
        if (key.includes('attribute_')) {
          let inQuery = '('
          query[key].forEach((value) => {
            inQuery += `'${value}',`
          })
          inQuery = inQuery.substring(0, inQuery.length - 1)
          inQuery += ')'
          console.log(inQuery)
          if (whereQueries.length === 0) {
            whereQueries += `attribute.short_id='${key}' AND attribute_value.value_string IN ${inQuery} `
          } else {
            whereQueries += `AND attribute.short_id='${key}' AND attribute_value.value_string ${inQuery} `
          }
        }
      }
    }

    // if (query['keyword']) {
    //   if (whereQueries.length === 0) {
    //     whereQueries += `LOWER(product.product_name) LIKE '%${query['keyword'][0].toLowerCase()}%' `
    //   } else {
    //     whereQueries += `AND LOWER(product.product_name) LIKE '%${query['keyword'][0].toLowerCase()}%' `
    //   }
    // }

    if (query['sortBy']) {
      switch (query['sortBy'][0]) {
        case 'ctime':
          baseQuery.orderBy('product.createdAt', 'DESC')
          break
      }
    }

    baseQuery.where(whereQueries)
    const total = await baseQuery.getCount()
    baseQuery.take(20)
    baseQuery.skip(parseInt(query['page'][0]))
    const result = await baseQuery.getMany()

    const resultWithPrices: Product[] = []

    const getPrices = result.map(async (product) => {
      const variances = await this.productVarianceRepository.find({ where: { product_id: product.id } })
      const prices = variances
        .map((variance) => {
          return variance.productPriceHistories[0].price
        })
        .sort((a, b) => b - a)
      product['price_lowest'] = prices[prices.length - 1]
      product['price_highest'] = prices[0]
      product['product_images'] = product.images.map((image) => {
        return image.image_url
      })
      delete product.images
      resultWithPrices.push(product)
    })

    await Promise.all(getPrices)

    return resultWithPrices
  }
}

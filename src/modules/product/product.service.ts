import { Inject, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import CreateProductDTO from 'src/dtos/create-product.dto'
import AttributeSet from 'src/entities/attribute-set.entity'
import Attribute from 'src/entities/attribute.entity'
import Category from 'src/entities/category.entity'
import Product from 'src/entities/product.entity'
import { DataSource, EntityManager, ILike, In, Like, Repository, getManager } from 'typeorm'
import { AttributeService } from '../attribute/attribute.service'
import ProductVariance from 'src/entities/product-variance.entity'
import ProductImage from 'src/entities/product-image.entity'
import ProductPriceHistory from 'src/entities/product-price-history.entity'
import ProductVarianceImage from 'src/entities/product-variance-image.entity'
import { slugGenerator } from 'src/utils/utils'
import { CategoryService } from '../category/category.service'
import { TPagingListResponse } from 'src/types/response.types'
import Brand from 'src/entities/brand.entity'

@Injectable()
export class ProductService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
    @InjectRepository(ProductVariance) private productVarianceRepository: Repository<ProductVariance>,
    @InjectRepository(ProductImage) private productImageRepository: Repository<ProductImage>,
    @InjectRepository(ProductVarianceImage) private productVarianceImageRepository: Repository<ProductVarianceImage>,
    @InjectRepository(ProductPriceHistory) private productPriceHistoryRepository: Repository<ProductPriceHistory>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    @Inject(AttributeService) private attributeService: AttributeService,
    @Inject(CategoryService) private categoryService: CategoryService,

    private datasource: DataSource
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
          id: string
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
            id: variance.id,
          },
        }
      } else {
        productVariance[`${attribute2.value_string}:${attribute2.attribute.attribute_name}`] = {
          ...productVariance[`${attribute2.value_string}:${attribute2.attribute.attribute_name}`],
          [`${attribute1.value_string}:${attribute1.attribute.attribute_name}`]: {
            qty,
            price,
            imageURL: variance.productVarianceImages[0] ? variance.productVarianceImages[0].image_url : '',
            id: variance.id,
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
    const category = await this.categoryRepository.findOne({ where: { id: category_id } })
    const brand = await this.brandRepository.findOne({ where: { id: brand_id } })
    await this.entityManager.query(`
    UPDATE product
    SET document = setweight(to_tsvector(product_name), 'A') 
    || setweight(to_tsvector('${category.category_name}'), 'B')
    || setweight(to_tsvector('${brand.brand_name}'), 'C')
    || setweight(to_tsvector(slug), 'D')
    WHERE id='${createProductRes.id}'
    `)
    return createProductRes
  }

  async searchProducts(searchParams: string): Promise<TPagingListResponse<Product>> {
    let query: { [key: string]: string[] } = {}
    const itemsPerPage = 30
    searchParams.split('&').forEach((item) => {
      if (item.includes('=')) {
        query[item.split('=')[0]] = item.split('=')[1].split(',')
      }
    })

    let baseQuery = this.productRepository.createQueryBuilder('product').select('product').leftJoinAndSelect('product.images', 'images')

    let whereQueries = ''
    let documentQryString = ''
    if (query['keyword']) {
      const keywordArr = query['keyword'][0].trim().split(' ')
      keywordArr.forEach((word, i) => {
        if (i < keywordArr.length - 1) {
          documentQryString += `${word}:* & `
        } else {
          documentQryString += `${word}:*`
        }
      })
      whereQueries += `document @@ to_tsquery('${documentQryString}')`
    }

    if (Object.keys(query).some((key) => key.includes('attribute_'))) {
      const attributeEntries = Object.entries(query).filter((entry) => entry[0].includes('attribute_'))
      const setIds = await this.getAttributeSetIdsBaseOnQuery(attributeEntries)
      if (setIds.length > 0) {
        let inValuesQuery = 'IN ('
        setIds.forEach((id) => {
          inValuesQuery += `'${id}',`
        })
        inValuesQuery = inValuesQuery.substring(0, inValuesQuery.length - 1) + ')'
        whereQueries += `AND product.attribute_set_id ${inValuesQuery} `
      } else {
        return {
          current_page: parseInt(query['page'][0]),
          data: [],
          has_next: false,
          total: 0,
          total_page: 0,
        }
      }
    }

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

    if (query['brands']) {
      baseQuery.leftJoin('brand', 'brand', 'brand.id=product.brand_id')
      let inQuery = '('
      query['brands'].forEach((value) => {
        inQuery += `'${value}',`
      })
      inQuery = inQuery.substring(0, inQuery.length - 1)
      inQuery += ')'
      if (whereQueries.length === 0) {
        whereQueries += `brand.brand_name IN ${inQuery} `
      } else {
        whereQueries += `AND brand.brand_name IN ${inQuery} `
      }
      delete query['brands']
    }

    if (query['sortBy']) {
      switch (query['sortBy'][0]) {
        case 'ctime':
          baseQuery.orderBy('product.createdAt', 'DESC')
          break
        case 'pop':
          baseQuery.orderBy('product.createdAt', 'DESC')
          break
        case 'sales':
          baseQuery.orderBy('product.createdAt', 'DESC')
          break
      }
    }

    baseQuery.where(whereQueries)
    let total = await baseQuery.getCount()
    total *= 300
    baseQuery.take(itemsPerPage)
    // baseQuery.skip(parseInt(query['page'][0]))
    const result = await baseQuery.getMany()
    const total_page = Math.ceil(total / itemsPerPage)
    const current_page = parseInt(query['page'][0])
    const has_next = current_page + 1 < total_page
    if (result.length > 0) {
      let resultWithPrices = result.map((product) => {
        product['product_images'] = product.images.map((image) => {
          return image.image_url
        })
        delete product.images
        product['prices'] = []
        return product
      })

      const productIds = result.map((product) => {
        return product.id
      })

      const variances = await this.productVarianceRepository.findBy({ product_id: In(productIds) })
      variances.forEach((variance) => {
        const productId = variance.product_id
        const index = resultWithPrices.findIndex((product) => product.id === productId)
        resultWithPrices[index]['prices'].push(variance.productPriceHistories[0].price)
      })
      return {
        data: Array(30)
          .fill(resultWithPrices[0])
          .map((item: Product, i) => {
            item.id = item.id + i * (parseInt(query['page'][0]) + 1)
            return item
          }),
        current_page: parseInt(query['page'][0]),
        has_next,
        total,
        total_page,
      }
    } else {
      return {
        current_page: parseInt(query['page'][0]),
        data: [],
        has_next: false,
        total: 0,
        total_page,
      }
    }
  }

  async getAttributeSetIdsBaseOnQuery(attributeEntries: [string, string[]][]): Promise<string[]> {
    const intersectBaseQuery = `
      SELECT ats.id
      FROM attribute_set_value_mapping asvm
      JOIN attribute_set ats ON ats.id=asvm.attribute_set_id
      JOIN attribute_value atv ON asvm.attribute_value_id=atv.id
      JOIN attribute atr ON atr.id = atv.attribute_id
      JOIN product pd ON pd.attribute_set_id = ats.id`
    const queriesToIntersect = [] as string[]
    attributeEntries.forEach((entry) => {
      const short_id = entry[0]
      const whereQuery = `WHERE atr.short_id='${short_id}' AND atv.value_string`
      let inValuesQuery = 'IN ('
      entry[1].forEach((value) => {
        inValuesQuery += `'${value}',`
      })
      inValuesQuery = inValuesQuery.substring(0, inValuesQuery.length - 1) + ')'
      const wholeQuery = `${intersectBaseQuery} ${whereQuery} ${inValuesQuery}`
      queriesToIntersect.push(wholeQuery)
    })
    let rawQuery = ''
    queriesToIntersect.forEach((query, i) => {
      rawQuery += query
      if (i < queriesToIntersect.length - 1) {
        rawQuery += ' INTERSECT'
      }
    })
    rawQuery += ' GROUP BY ats.id'
    const result = await this.datasource.query(rawQuery)
    return result.map((item: { id: string }) => item.id)
  }

  async getSearchFilters(searchParams: string) {
    let query: { [key: string]: string[] } = {}
    searchParams.split('&').forEach((item) => {
      query[item.split('=')[0]] = item.split('=')[1].split(',')
    })
    let productFilters: { [key: string]: { name: string; values: any[] } } = {
      brands: {
        name: 'Brand',
        values: [],
      },
    }
    if (query['c']) {
      const categorySlugs = query['c']
      const categories = await this.categoryRepository.findBy({ slug: In(categorySlugs) })
      if (categories.length === 0) return []
      const attributeSet = categories[0].attributeSet
      if (!attributeSet) return []
      const categoryDetails = await this.categoryService.getCategoryDetails(categories[0].id, null)
      categoryDetails.brands.forEach((brand) => {
        productFilters.brands.values.push(brand.brand_name)
      })
      attributeSet.attributeSetValueMappings.map((avm) => {
        const valueType = avm.attributeValue.attribute.value_type
        let value = null
        switch (valueType) {
          case 0:
            value = avm.attributeValue.value_decimal
            break
          case 1:
            value = avm.attributeValue.value_int
            break
          case 2:
            value = avm.attributeValue.value_string
            break
        }
        if (value) {
          const attributeName = avm.attributeValue.attribute.attribute_name
          const attributeShortId = avm.attributeValue.attribute.short_id
          if (!productFilters[attributeShortId]) {
            productFilters[attributeShortId] = { name: attributeName, values: [value] }
          } else {
            productFilters[attributeShortId].values.push(value)
          }
        }
      })
      return productFilters
    }
    if (query['keyword'] && !query['c']) {
      let documentQryString = ''
      const keywordArr = query['keyword'][0].trim().split(' ')
      keywordArr.forEach((word, i) => {
        if (i < keywordArr.length - 1) {
          documentQryString += `${word}:* & `
        } else {
          documentQryString += `${word}:*`
        }
      })

      const product = await this.productRepository
        .createQueryBuilder('pd')
        .leftJoinAndSelect('pd.category', 'category')
        .leftJoinAndSelect('category.attributeSet', 'attributeSet')
        .leftJoinAndSelect('attributeSet.attributeSetValueMappings', 'attributeSetValueMappings')
        .leftJoinAndSelect('attributeSetValueMappings.attributeValue', 'attributeValue')
        .leftJoinAndSelect('attributeValue.attribute', 'attribute')
        .where(`document @@ to_tsquery('${documentQryString}')`)
        .getOne()

      if (!product) return []
      const attributeSet = product.category.attributeSet
      const categoryDetails = await this.categoryService.getCategoryDetails(product.category.id, null)
      categoryDetails.brands.forEach((brand) => {
        productFilters.brands.values.push(brand.brand_name)
      })
      attributeSet.attributeSetValueMappings.map((avm) => {
        const valueType = avm.attributeValue.attribute.value_type
        let value = null
        switch (valueType) {
          case 0:
            value = avm.attributeValue.value_decimal
            break
          case 1:
            value = avm.attributeValue.value_int
            break
          case 2:
            value = avm.attributeValue.value_string
            break
        }
        if (value) {
          const attributeName = avm.attributeValue.attribute.attribute_name
          const attributeShortId = avm.attributeValue.attribute.short_id
          if (!productFilters[attributeShortId]) {
            productFilters[attributeShortId] = { name: attributeName, values: [value] }
          } else {
            productFilters[attributeShortId].values.push(value)
          }
        }
      })
      return productFilters
    }
  }
}

import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import User from 'src/entities/user.entity'
import { Repository, EntityManager } from 'typeorm'
import { compareSync, hashSync } from 'bcrypt'
import CreateUserDTO from 'src/dtos/create-user.dto'
import Cart from 'src/entities/cart.entity'
import CartItem from 'src/entities/cart-item.entity'
import AddToCartDTO from 'src/dtos/add-to-cart.dto'
import Product from 'src/entities/product.entity'
import RemoveFromCartDTO from 'src/dtos/remove-from-cart.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product) private productRepository: Repository<Product>
  ) {}

  async getAll(): Promise<Array<User>> {
    const result = await this.entityManager.query(`SELECT * FROM public."user"`)
    return result
  }

  async create(username: string, password: string): Promise<User> {
    const checkExisted = await this.userRepository.findOne({ where: { username } })
    const hashedPassword = hashSync(password, 10)
    if (checkExisted) return null
    const userRepository = this.userRepository.create({
      username,
      password: hashedPassword,
    })
    try {
      const result = await userRepository.save()
      return result
    } catch (error) {
      return null
    }
  }

  async formattedUserData(user: User, userCart: Cart): Promise<User> {
    const formattedUserData = structuredClone(user)
    const formattedCartData = await this.formattedCartData(userCart)
    formattedUserData['cart'] = formattedCartData
    return formattedUserData
  }

  async formattedCartData(cart: Cart) {
    const formattedCartData = structuredClone(cart)
    let cartItems: any[] = []
    const getAllCartItems = formattedCartData.items.map(async (item: CartItem) => {
      const mainAttribute = item.productVariance.attributeSet.attributeSetValueMappings[0]
      const subAttribute = item.productVariance.attributeSet.attributeSetValueMappings[1]
      const product = await this.productRepository.findOne({ where: { id: item.productVariance.product_id } })
      const cartItem = {
        id: item.id,
        product_variance_id: item.product_variance_id,
        quantity: item.quantity,
        price: item.productVariance.productPriceHistories[0].price,
        total_price: item.productVariance.productPriceHistories[0].price * item.quantity,
        image: item.productVariance.productVarianceImages[0].image_url,
        product: product,
        variance: {
          main: {
            attribute_name: mainAttribute.attributeValue.attribute.attribute_name,
            attribute_value: mainAttribute.attributeValue.value_string,
          },
          sub: {
            attribute_name: subAttribute.attributeValue.attribute.attribute_name,
            attribute_value: subAttribute.attributeValue.value_string,
          },
        },
      }
      cartItems.push(cartItem)
    })
    await Promise.all(getAllCartItems)
    formattedCartData['cart_items'] = cartItems
    delete formattedCartData['items']
    return formattedCartData
  }

  async login(loginDTO: CreateUserDTO): Promise<User> {
    let user = await this.userRepository.findOne({ where: { username: loginDTO.username } })

    if (!user) return null
    const isPasswordValid = compareSync(loginDTO.password, user.password)
    if (isPasswordValid) {
      const userCart = await this.cartRepository.findOne({ where: { user_id: user.id } })
      if (userCart) {
        user = await this.formattedUserData(user, userCart)
      }
      delete user.password
      return user
    } else {
      return null
    }
  }

  async getUserByIdAuthentication(userId: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { id: userId } })
    if (user) {
      const userCart = await this.cartRepository.findOne({ where: { user_id: user.id } })
      if (userCart) {
        user = await this.formattedUserData(user, userCart)
      }
      delete user.password
      return user
    } else {
      return null
    }
  }

  async addToCart(addToCartDTO: AddToCartDTO, user_id: string): Promise<Cart> {
    const { product_variance_id, quantity } = addToCartDTO
    console.log(user_id)
    const existedCart = await this.cartRepository.findOne({ where: { user_id } })
    let cart: Cart = null
    if (!existedCart) {
      const newCart = this.cartRepository.create({
        user_id,
      })
      const createCartRes = await newCart.save()
      cart = createCartRes
    } else {
      cart = existedCart
    }
    const existedItem = await this.cartItemRepository.findOne({ where: { cart_id: cart.id, product_variance_id } })
    if (!existedItem) {
      const newCartItem = this.cartItemRepository.create({
        product_variance_id,
        cart_id: cart.id,
        quantity: quantity,
      })
      await newCartItem.save()
    } else {
      existedItem.quantity += quantity
      await existedItem.save()
    }
    const updatedCart = await this.cartRepository.findOne({ where: { id: cart.id } })
    const formattedCartData = await this.formattedCartData(updatedCart)
    return formattedCartData
  }

  async removeFromCart(removeFromCartDTO: RemoveFromCartDTO, user_id: string): Promise<Cart> {
    const { product_variance_id } = removeFromCartDTO
    const existedCart = await this.cartRepository.findOne({ where: { user_id } })
    if (!existedCart) return null

    const existedItem = await this.cartItemRepository.findOne({ where: { cart_id: existedCart.id, product_variance_id } })
    if (!existedItem) return null

    try {
      await this.cartItemRepository.remove(existedItem)
      const updatedCart = await this.cartRepository.findOne({ where: { id: existedCart.id } })
      const formattedCartData = await this.formattedCartData(updatedCart)
      return formattedCartData
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async getCheckoutSummary(userId: string, cartItemIds: string[]): Promise<any[]> {
    const cart = await this.cartRepository.findOne({ where: { user_id: userId } })
    if (!cart) return null
    let formattedCartData = await this.formattedCartData(cart)
    formattedCartData['cart_items'] = formattedCartData['cart_items'].filter((item: any) => cartItemIds.includes(item.id))
    return formattedCartData['cart_items']
  }
}

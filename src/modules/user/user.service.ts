import { Inject, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import shortid from 'shortid'
import User from 'src/entities/user.entity'
import { Repository, EntityManager } from 'typeorm'
import { compareSync, hashSync } from 'bcrypt'
import CreateUserDTO from 'src/dtos/create-user.dto'
import Cart from 'src/entities/cart.entity'
import CartItem from 'src/entities/cart-item.entity'
import AddToCartDTO from 'src/dtos/add-to-cart.dto'
import Product from 'src/entities/product.entity'
import RemoveFromCartDTO from 'src/dtos/remove-from-cart.dto'
import { JwtService } from '@nestjs/jwt'
import MailService from '../mail/mail.service'
import LoginDTO from 'src/dtos/login.dto'
import SendMailDTO from 'src/dtos/send-mail.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @Inject(MailService) private mailService: MailService,
    private readonly jwtService: JwtService
  ) {}

  async getAll(): Promise<Array<User>> {
    const result = await this.entityManager.query(`SELECT * FROM public."user"`)
    return result
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const { username, email, password } = createUserDTO
    const checkExisted = await this.userRepository.findOne({ where: [{ username }, { email }] })
    if (checkExisted) return null

    const hashedPassword = hashSync(password, 10)
    const userRepository = this.userRepository.create({
      username,
      password: hashedPassword,
      is_active: false,
      email,
      verify_id: shortid.generate(),
    })
    try {
      const newUserRes = await userRepository.save()
      const sendMailDTO: SendMailDTO = {
        htmlContent: `<h1>Click to this link: <a href='${process.env.CLIENT_HOST_URL}/verify/${newUserRes.verify_id}'>${process.env.CLIENT_HOST_URL}/verify/${newUserRes.verify_id}</a> to verify your account`,
        subject: 'Verify Account',
        to: newUserRes.email,
      }
      this.mailService.handleSendMail(sendMailDTO)
      return newUserRes
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async verifyAccount(verifyId: string): Promise<-1 | 0 | 1> {
    try {
      const user = await this.userRepository.findOne({ where: { verify_id: verifyId } })
      if (!user) return -1
      if (user.is_active) return 0
      user.is_active = true
      await user.save()
      return 1
    } catch (error) {
      console.log('verifyAccount error: ' + error)
      return -1
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

  async login(loginDTO: LoginDTO): Promise<User> {
    let user = await this.userRepository.findOne({ where: { username: loginDTO.username, is_active: true } })
    if (!user) return null
    const isPasswordValid = compareSync(loginDTO.password, user.password)
    console.log(isPasswordValid)
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

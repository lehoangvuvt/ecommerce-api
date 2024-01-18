import { Module, Global } from '@nestjs/common'
import AuthService from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import User from 'src/entities/user.entity'
import Cart from 'src/entities/cart.entity'
import CartItem from 'src/entities/cart-item.entity'
import Product from 'src/entities/product.entity'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, CartItem, Product]), JwtModule.register({})],
  controllers: [],
  exports: [AuthService],
  providers: [AuthService, UserService],
})
export class AuthModule {}

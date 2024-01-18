import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import User from 'src/entities/user.entity'
import { JwtModule } from '@nestjs/jwt'
import CartItem from 'src/entities/cart-item.entity'
import Cart from 'src/entities/cart.entity'
import Product from 'src/entities/product.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, CartItem, Product]), JwtModule.register({})],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

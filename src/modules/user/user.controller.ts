import { Body, Controller, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { Response } from 'express'
import { ApiBody, ApiCreatedResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import CreateUserDTO from 'src/dtos/create-user.dto'
import User from 'src/entities/user.entity'
import AuthService from '../auth/auth.service'
import { tokenConfig } from 'src/config/token.config'
import AddToCartDTO from 'src/dtos/add-to-cart.dto'
import Cart from 'src/entities/cart.entity'
import { TokenVerifyGuard } from '../auth/tokenVerify.guard'
import RemoveFromCartDTO from 'src/dtos/remove-from-cart.dto'
import LoginDTO from 'src/dtos/login.dto'
import VerifyAccountDTO from 'src/dtos/verify-account.dto'

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService, private readonly authService: AuthService) {}

  @Get('/')
  async getUsers(@Res() res: Response) {
    const result = await this.service.getAll()
    return res.status(200).json(result)
  }

  @ApiBody({ type: CreateUserDTO })
  @ApiCreatedResponse({ description: 'The record has been successfully created.', type: User })
  @Post('/sign-up')
  async createUser(@Body() createUserDTO: CreateUserDTO, @Res() res: Response) {
    const result = await this.service.create(createUserDTO)
    if (!result) return res.status(400).json({ error: 'Username or email already existed' })
    return res.status(201).json({ message: 'Sign up success!' })
  }

  @ApiBody({ type: LoginDTO })
  @ApiResponse({ description: 'Login success', status: 200, type: User })
  @Post('login')
  async login(@Body() loginDTO: LoginDTO, @Res() res: Response) {
    const response = await this.service.login(loginDTO)
    if (response) {
      const refreshToken = await this.authService.signToken('refresh_token', { id: response.id })
      const accessToken = await this.authService.signToken('access_token', { id: response.id })
      res.cookie('refresh_token', refreshToken, tokenConfig.refreshToken.cookieOptions)
      res.cookie('access_token', accessToken, tokenConfig.accessToken.cookieOptions)
      return res.status(200).json({
        ...response,
        accessToken,
        refreshToken,
      })
    } else {
      return res.status(401).json({
        error: 'Login failed',
      })
    }
  }

  @UseGuards(TokenVerifyGuard)
  @ApiBody({ type: AddToCartDTO })
  @ApiCreatedResponse({ description: 'Add to cart Success', type: Cart })
  @Post('add-to-cart')
  async addToCart(@Body() addToCartDTO: AddToCartDTO, @Req() req: any, @Res() res: Response) {
    const user_id = req.id
    const response = await this.service.addToCart(addToCartDTO, user_id)
    if (!response) return res.status(400).json({ error: 'Something error' })
    return res.status(201).json(response)
  }

  @UseGuards(TokenVerifyGuard)
  @ApiBody({ type: RemoveFromCartDTO })
  @ApiResponse({ description: 'Remove from cart Success', type: Cart, status: 200 })
  @Post('remove-from-cart')
  async removeFromCart(@Body() removeFromCartDTO: RemoveFromCartDTO, @Req() req: any, @Res() res: Response) {
    const user_id = req.id
    const response = await this.service.removeFromCart(removeFromCartDTO, user_id)
    if (!response) return res.status(400).json({ error: 'Something error' })
    return res.status(200).json(response)
  }

  @UseGuards(TokenVerifyGuard)
  @ApiBody({ type: RemoveFromCartDTO })
  @ApiParam({ name: 'params', type: String })
  @ApiResponse({ description: 'Get checkout summary', status: 200 })
  @Get('check-out/summary/:params')
  async getPreOrderSummary(@Param() params: { params: string }, @Req() req: any, @Res() res: Response) {
    const user_id = req.id
    const response = await this.service.getCheckoutSummary(user_id, params.params.split(','))

    if (!response) return res.status(400).json({ error: 'Something error' })
    return res.status(200).json(response)
  }

  @Get('refresh-token')
  async getAccessTokenByRefreshToken(@Req() req: any, @Res() res: Response) {
    if (req.cookies && req.cookies['refresh_token']) {
      const refresh_token = req.cookies['refresh_token']
      const validateToken = await this.authService.validateToken('refresh_token', refresh_token)
      if (!validateToken) return res.status(401).json({ error: 'Refresh token invalid' })
      const accessToken = await this.authService.signToken('access_token', { id: validateToken.id })
      res.cookie('access_token', accessToken, tokenConfig.accessToken.cookieOptions)
      return res.status(200).json({ accessToken })
    } else {
      return res.status(401).json({ error: 'Refresh token invalid' })
    }
  }

  @Get('authentication')
  async anthentication(@Req() request: any, @Res() res: Response) {
    if (!request.cookies || !request.cookies['access_token']) return res.status(401).json({ error: 'Authentication failed' })

    const accessToken = request.cookies['access_token']
    const refreshToken = request.cookies['refresh_token']

    const validateAccessToken = await this.authService.validateToken('access_token', accessToken)
    if (validateAccessToken) return res.status(200).json({ ...validateAccessToken, accessToken, refreshToken })

    const validateRfToken = await this.authService.validateToken('refresh_token', refreshToken)
    if (!validateRfToken) return res.status(401).json({ error: 'Authentication failed' })

    const newAccessToken = await this.authService.signToken('access_token', { id: validateRfToken.id })
    res.cookie('access_token', newAccessToken, tokenConfig.accessToken.cookieOptions)
    return res.status(200).json({
      ...validateRfToken,
      refreshToken,
      newAccessToken,
    })
  }

  @Get('logout')
  async logOut(@Req() req: any, @Res() res: Response) {
    res.clearCookie('access_token', { path: '/', sameSite: 'none', secure: true })
    res.clearCookie('refresh_token', { path: '/', sameSite: 'none', secure: true })
    return res.status(200).json({ message: 'Logout success' })
  }

  @ApiBody({ type: VerifyAccountDTO })
  @Put('verify')
  async verifyAccount(@Body() verifyAccountDTO: VerifyAccountDTO, @Res() res: Response) {
    const response = await this.service.verifyAccount(verifyAccountDTO.verify_id)
    if (response === -1) return res.status(404).json({ error: 'Wrong verify link' })
    if (response === 0) return res.status(400).json({ error: 'Account already verified' })
    return res.status(200).json({ message: 'Verify account successfully!' })
  }
}

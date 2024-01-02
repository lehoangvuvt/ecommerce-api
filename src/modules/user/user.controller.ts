import { Body, Controller, Get, Post, Res } from '@nestjs/common'
import { UserService } from './user.service'
import { Response } from 'express'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getUsers(@Res() res: Response) {
    const result = await this.userService.getAll()
    return res.status(200).json(result)
  }

  @Post('/create')
  async createUser(@Body() body: { username: string; password: string }, @Res() res: Response) {
    const result = await this.userService.insert(body.username, body.password)
    if (!result) return res.status(400).json({ error: 'Dup username' })
    return res.status(200).json(result)
  }
}

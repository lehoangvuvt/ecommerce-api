import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export default class LoginDTO {
  @ApiProperty({ type: String, description: 'username', required: true })
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty({ type: String, description: 'password', required: true })
  @IsString()
  @IsNotEmpty()
  password: string
}

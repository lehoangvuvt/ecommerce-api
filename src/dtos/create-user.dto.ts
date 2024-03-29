import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export default class CreateUserDTO {
  @ApiProperty({ type: String, description: 'username', required: true })
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty({ type: String, description: 'password', required: true })
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty({ type: String, description: 'email', required: true })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string
}

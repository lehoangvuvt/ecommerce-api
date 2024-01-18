import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export default class CreateUserDTO {
  @ApiProperty({ type: String, description: 'username', required: true })
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty({ type: String, description: 'password', required: true })
  @IsString()
  @IsNotEmpty()
  password: string
}

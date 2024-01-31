import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, NotContains } from 'class-validator'

export default class SendMailDTO {
  @ApiProperty({ type: String, description: `Email's subject`, required: true })
  @IsString()
  @IsNotEmpty()
  subject: string

  @ApiProperty({ type: String, description: `Email's html content in string format`, required: true })
  @IsString()
  @IsNotEmpty()
  htmlContent: string

  @ApiProperty({ type: String, description: `Email's address of user want to send mail to`, required: true })
  @IsString()
  @IsEmail()
  to: string
}

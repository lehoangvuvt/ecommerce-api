import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export default class VerifyAccountDTO {
  @ApiProperty({ type: String, description: 'Verify Id', required: true })
  @IsString()
  @IsNotEmpty()
  verify_id: string
}

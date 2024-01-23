import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsNotEmpty, IsString, NotContains } from 'class-validator'

export default class CreateStoreDTO {
  @ApiProperty({ type: String, description: 'URL of store', required: true })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  url: string

  @ApiProperty({ type: String, description: 'Name of store', required: true })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ type: String, description: 'Avatar url of store', required: true })
  @IsString()
  @IsNotEmpty()
  avatar_url: string

  @ApiProperty({ type: String, description: 'Background image url', required: true })
  @IsString()
  @IsNotEmpty()
  background_url: string

  @ApiProperty({ type: String, description: 'Banner img url of store', required: true })
  @IsString()
  @IsNotEmpty()
  banner_url: string
}

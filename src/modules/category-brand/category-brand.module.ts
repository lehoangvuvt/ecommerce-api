import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import CategoryBrand from 'src/entities/category-brand.entity'
import { CategoryBrandController } from './category-brand.controller'
import { CategoryBrandService } from './category-brand.service'

@Module({
  imports: [TypeOrmModule.forFeature([CategoryBrand])],
  controllers: [CategoryBrandController],
  providers: [CategoryBrandService],
})
export class CategoryBrandModule {}

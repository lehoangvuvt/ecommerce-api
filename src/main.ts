import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cors({ credentials: true, origin: process.env.CLIENT_HOST_URL }))
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe())
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb' }))
  const config = new DocumentBuilder().setTitle('Ecommerce API').setDescription('API for ecommerce').setVersion('1.0').build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-documents', app, document)
  const PORT = process.env.PORT || 3000
  await app.listen(PORT)
}
bootstrap()
3

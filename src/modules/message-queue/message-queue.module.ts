import { Global, Module } from '@nestjs/common'
import MailService from './message-queue.service'
import RabbitMqService from 'src/services/rabbitmq.service'
import MessageQueueService from './message-queue.service'

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [MessageQueueService, RabbitMqService],
  exports: [MailService],
})
export class MessageQueueModule {}

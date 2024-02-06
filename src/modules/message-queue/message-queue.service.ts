import { Injectable, Global, OnApplicationBootstrap } from '@nestjs/common'
import nodemailer from 'nodemailer'
import SendMailDTO from 'src/dtos/send-mail.dto'
import RabbitMqService from 'src/services/rabbitmq.service'
@Global()
@Injectable()
export default class MessageQueueService implements OnApplicationBootstrap {
  constructor(private readonly rabbitMqService: RabbitMqService) {}

  onApplicationBootstrap() {
    this.rabbitMqService.connect((error, channel) => {
      if (error) {
        console.log(error)
        return
      }
      console.log('Connect RabbitMQ success')
      channel.assertQueue('task_send_mail', { durable: true })
      channel.consume(
        'task_send_mail',
        (msg) => {
          console.log('task_send_mail')
          const sendMailDTO: SendMailDTO = JSON.parse(msg.content.toString())
          this.handleSendMail(sendMailDTO)
        },
        {
          noAck: false,
        }
      )
      console.log('AssertQueue task_send_mail success')
    })
  }

  sendQueueTask_SendEmail(sendMailDTO: SendMailDTO) {
    try {
      return this.rabbitMqService.getChannel().sendToQueue('task_send_mail', Buffer.from(JSON.stringify(sendMailDTO)), {
        persistent: true,
      })
    } catch (error) {
      console.log('testTaskMailQueue error: ' + error)
      return false
    }
  }

  async handleSendMail(sendMailDTO: SendMailDTO) {
    const { htmlContent, subject, to } = sendMailDTO
    const transporter = nodemailer.createTransport({
      service: 'Mail.ru',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    })
    try {
      await transporter.sendMail({
        from: process.env.MAIL_USERNAME,
        to,
        subject,
        html: htmlContent,
      })
      console.log('handleSendMail success')
    } catch (error) {
      console.log('handleSendMail error: ' + error)
    }
  }
}

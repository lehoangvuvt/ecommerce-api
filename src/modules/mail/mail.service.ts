import { Injectable, Global, Inject } from '@nestjs/common'
import nodemailer from 'nodemailer'
import amqplib, { Channel } from 'amqplib/callback_api'
import SendMailDTO from 'src/dtos/send-mail.dto'
@Global()
@Injectable()
export default class MailService {
  private rabbitMqChannel: Channel
  constructor() {
    const rabbitMq = amqplib
    rabbitMq.connect(
      `amqp://5Nz5MqvGXK4bQ3fC:qzAfB0~CF4AmOR1._d7epJ7bd-uB3flP@viaduct.proxy.rlwy.net:23801`,
      (connectError: any, connection: amqplib.Connection) => {
        if (connectError) {
          throw connectError
        } else {
          connection.createChannel((createChannelError: any, channel: Channel) => {
            if (createChannelError) {
              throw createChannelError
            } else {
              this.rabbitMqChannel = channel
              this.rabbitMqChannel.assertQueue('task_send_mail', { durable: true })
              this.rabbitMqChannel.consume(
                'task_send_mail',
                (msg) => {
                  console.log('task_send_mail')
                  const sendMailDTO: SendMailDTO = JSON.parse(msg.content.toString())
                  this.handleSendMail(sendMailDTO)
                },
                {
                  noAck: true,
                }
              )
              console.log('success')
            }
          })
        }
      }
    )
  }

  testTaskMailQueue(sendMailDTO: SendMailDTO) {
    try {
      return this.rabbitMqChannel.sendToQueue('task_send_mail', Buffer.from(JSON.stringify(sendMailDTO)), {
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
      const response = await transporter.sendMail({
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

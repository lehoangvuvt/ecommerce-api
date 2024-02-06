import { Injectable } from '@nestjs/common'
import amqplib, { Channel } from 'amqplib/callback_api'
export default class RabbitMqService {
  private rabbitMqChannel: Channel

  constructor() {}

  connect(callback: (error: any, channel: Channel) => void) {
    const rabbitMq = amqplib
    rabbitMq.connect(
      `amqp://${process.env.RAMQ_USER}:${process.env.RAMQ_PASSWORD}@${process.env.RAMQ_DOMAIN}`,
      // `amqp://localhost`,
      (connectError: any, connection: amqplib.Connection) => {
        if (connectError) {
          throw connectError
        }
        connection.createChannel((createChannelError: any, channel: Channel) => {
          if (createChannelError) {
            callback(createChannelError, null)
            throw createChannelError
          }
          this.rabbitMqChannel = channel
          callback(null, this.rabbitMqChannel)
        })
      }
    )
  }

  getChannel() {
    return this.rabbitMqChannel
  }
}

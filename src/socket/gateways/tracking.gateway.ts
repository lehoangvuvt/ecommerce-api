import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'
import { tokenConfig } from '../../config/token.config'
import { UserService } from 'src/modules/user/user.service'
import { Inject } from '@nestjs/common'
import { TrackingService } from 'src/modules/tracking/tracking.service'

type Client = {
  userId: string
  clientId: string
  channelId?: string
  serverId?: string
}

@WebSocketGateway({ namespace: '/socket/tracking' })
export class TrackingGateway {
  @WebSocketServer()
  server: Server
  private clients: Map<string, Client> = new Map()
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(TrackingService) private trackingService: TrackingService,
    private jwtService: JwtService
  ) {}

  async authenticate(id: string) {
    if (!this.clients.has(id)) return false
    const user = await this.userService.getUserByIdAuthentication(id)
    if (!user) return false
    return true
  }

  async handleConnection(client: Socket) {
    console.log(true)
    if (!client.handshake && client.handshake.auth && client.handshake.auth.accessToken) client.disconnect()
    try {
      const decoded = await this.jwtService.verifyAsync(client.handshake.auth.accessToken, {
        secret: tokenConfig.ACCESS_TOKEN_SECRET_KEY,
      })
      if (!decoded) client.disconnect()
      const id = decoded.id
      const user = await this.userService.getUserByIdAuthentication(id)
      if (!user) client.disconnect()
      this.clients.set(id, { userId: id, clientId: client.id, channelId: null, serverId: null })
      client.send('connected', 'asda')
      console.log('connected')
    } catch (err) {
      console.log(err)
      console.log('Disconnected')
      client.disconnect()
    }
  }

  @SubscribeMessage('disconnect')
  async handleDisconnect(client: Socket, data: string) {
    for (let [key, value] of this.clients) {
      if (value.clientId === client.id) {
        this.clients.delete(key)
      }
    }
  }

  @SubscribeMessage('listenTrackingCoords')
  async handleListenTrackingInfo(client: Socket, data: string) {
    const clientData: { orderId: string } = JSON.parse(data)
    const trackingInfo = await this.trackingService.getTrackingData(clientData.orderId)
    let lat = parseFloat(trackingInfo.lat)
    let lon = parseFloat(trackingInfo.lon)
    let driverLat = 10.754
    let driverLon = 106.6634
    let latChangeAmtPerSecond = 0.0002
    let lonChangeAmtPerSecond = 0.0002

    if (driverLat > lat) {
      latChangeAmtPerSecond *= -1
    }
    if (driverLon > lon) {
      lonChangeAmtPerSecond *= -1
    }
    let trackingData = [
      [lat, lon],
      [driverLat, driverLon],
    ]
    this.server.to(client.id).emit('receiveTrackingCoords', JSON.stringify(trackingData))
    do {
      if (Math.abs(driverLat - lat) > Math.abs(latChangeAmtPerSecond)) {
        driverLat += latChangeAmtPerSecond
      }
      if (Math.abs(driverLon - lon) > Math.abs(lonChangeAmtPerSecond)) {
        driverLon += lonChangeAmtPerSecond
      }
      trackingData = [
        [lat, lon],
        [driverLat, driverLon],
      ]
      console.log('1231s')
      this.server.to(client.id).emit('receiveTrackingCoords', JSON.stringify(trackingData))
      await new Promise((resolve) => setTimeout(() => resolve(1000), 1000))
    } while (Math.abs(driverLat - lat) > Math.abs(latChangeAmtPerSecond) || Math.abs(driverLon - lon) > Math.abs(lonChangeAmtPerSecond))
  }

  @SubscribeMessage('joinServer')
  async handleJoinServer(client: Socket, data: string) {
    const clientData: { id: string; serverId: string } = JSON.parse(data)
    const { id, serverId } = clientData

    const isAuth = await this.authenticate(id)
    if (!isAuth) return client.disconnect()

    const existedClient = this.clients.get(id)
    const currentChannelId = existedClient.channelId
    const currentServerId = existedClient.serverId

    if (currentChannelId) {
      client.leave(currentChannelId)
      console.log('[handleJoinServer] client.leave(currentChannelId)')
    }

    if (currentServerId) {
      client.leave(currentServerId)
      console.log('[handleJoinServer] client.leave(currentServerId)')
    }

    client.join(serverId)
    console.log('[handleJoinServer] client.join(serverId): ' + serverId)

    this.clients.set(id, {
      ...this.clients.get(id),
      serverId: serverId,
      clientId: client.id,
    })

    this.server.to(client.id).emit('joinedServer', serverId)
  }

  @SubscribeMessage('leaveServer')
  async handleLeaveServer(client: Socket, data: string) {
    const clientData: { id: string } = JSON.parse(data)
    const { id } = clientData

    const isAuth = await this.authenticate(id)
    if (!isAuth) return client.disconnect()

    const existedClient = this.clients.get(id)
    const currentChannelId = existedClient.channelId
    const currentServerId = existedClient.serverId

    if (currentChannelId) {
      client.leave(currentChannelId)
      console.log('[leaveChannel] client.leave(currentChannelId)')
    }

    if (currentServerId) {
      client.leave(currentServerId)
      console.log('[leaveChannel] client.leave(currentServerId)')
    }

    this.clients.set(id, {
      ...this.clients.get(id),
      channelId: null,
      serverId: null,
    })
  }

  @SubscribeMessage('joinChannel')
  async handleJoinChannel(client: Socket, data: string) {
    const clientData: { id: string; channelId: string } = JSON.parse(data)
    const { id, channelId } = clientData

    const isAuth = await this.authenticate(id)
    if (!isAuth) return client.disconnect()

    const currentChannelId = this.clients.get(id).channelId
    if (currentChannelId) {
      client.leave(currentChannelId)
      console.log('[joinChannel] client.leave(currentChannelId)')
      let userIdsInChannels = []
      for (var [_, item] of this.clients) {
        if (item.channelId === currentChannelId && item.userId !== id) {
          userIdsInChannels.push(item.userId)
        }
      }
      this.server.to(channelId).emit(`receiveOnlineChannel`, JSON.stringify(userIdsInChannels))
    }

    client.join(channelId)
    console.log('[joinChannel] client.join(channelId): ' + channelId)

    this.clients.set(id, {
      ...this.clients.get(id),
      channelId: channelId,
      clientId: client.id,
    })

    this.server.to(client.id).emit('joinedChannel', channelId)

    let userIdsInChannels = []
    for (var [_, item] of this.clients) {
      if (item.channelId === channelId) {
        userIdsInChannels.push(item.userId)
      }
    }

    this.server.to(channelId).emit(`receiveOnlineChannel`, JSON.stringify(userIdsInChannels))
  }

  @SubscribeMessage('leaveChannel')
  async handleLeaveChannel(client: Socket, data: string) {
    const clientData: { id: string } = JSON.parse(data)
    const { id } = clientData

    const isAuth = await this.authenticate(id)
    if (!isAuth) return client.disconnect()

    if (this.clients.get(id).channelId) {
      const currentChannelId = this.clients.get(id).channelId
      client.leave(currentChannelId)
      this.clients.set(id, {
        ...this.clients.get(id),
        channelId: null,
      })
      console.log('[leaveChannel] client.leave(currentChannelId): ' + currentChannelId)
    }
  }

  @SubscribeMessage('send')
  async handleSendMessage(client: Socket, data: string) {
    const clientData: { channelId: string; userId: string; message: string; fileIds: string[]; receiverId: string; type: 'channel' | 'p2p' } = JSON.parse(data)
    const { channelId, fileIds, message, receiverId, type, userId } = clientData

    const isAuth = await this.authenticate(userId)
    if (!isAuth) return client.disconnect()
  }
}

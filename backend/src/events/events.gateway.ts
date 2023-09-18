import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UserDto } from 'src/users/dto/user.dto';
import { EventsService } from './events.service';

type SocketWithUser = Socket & { user?: UserDto; instanceId?: string };

@WebSocketGateway({ namespace: 'api/events' })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('Events gateway');

  constructor(
    private authService: AuthService,
    private eventsService: EventsService
  ) {}

  @SubscribeMessage('log')
  handleLog(client: SocketWithUser, payload: unknown) {
    this.logger.log(client.user, payload);
  }

  @SubscribeMessage('position_update')
  handlePositionUpdate({ user, instanceId }: SocketWithUser, payload: unknown) {
    if (!user || !instanceId) {
      throw new WsException('No user or instace id for socket');
    }

    this.logger.log('position updated', user.id, payload);
  }

  handleDisconnect(client: SocketWithUser) {
    this.logger.log(`Client disconnected: ${client.id}`);
    if (client.user) {
      this.eventsService.unregisterSocket(client.user.id, client);
    }
  }

  async handleConnection(client: SocketWithUser) {
    const { token, instanceId } = client.handshake.auth;
    if (!token || !instanceId) {
      this.logger.error(`No token or instanceId for ${client.id}`);
      client.disconnect();
      return;
    }

    const result = await this.authService.verify(token);
    if (!result) {
      this.logger.error(`Token validation failed for ${client.id}`);
      client.disconnect();
      return;
    }
    this.logger.log(`Client connected: ${result.id}, ${result.login}, ${instanceId}`);
    client.user = result;
    client.instanceId = instanceId;
    this.eventsService.registerSocket(result.id, instanceId, client);
  }
}

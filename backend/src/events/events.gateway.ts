import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UserDto } from 'src/users/dto/user.dto';
import { EventsService } from './events.service';

type SocketWithUser = Socket & { user?: UserDto };

@WebSocketGateway({ namespace: 'api/events' })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('Events gateway');

  constructor(
    private authService: AuthService,
    private eventsService: EventsService
  ) {}

  @SubscribeMessage('log')
  handleMessage(client: SocketWithUser, payload: any) {
    this.logger.log(client.user, payload);
  }

  handleDisconnect(client: SocketWithUser) {
    this.logger.log(`Client disconnected: ${client.id}`);
    if (client.user) {
      this.eventsService.unregisterSocket(client.user.id, client);
    }
  }

  async handleConnection(client: SocketWithUser, ...args: any[]) {
    const { authorization } = client.handshake.headers;
    if (!authorization) {
      this.logger.error(`No authorization for ${client.id}`);
      client.disconnect();
      return;
    }

    const token = authorization.slice(authorization.indexOf(' ') + 1);
    const result = await this.authService.verify(token);
    if (!result) {
      this.logger.error(`Token validation failed for ${client.id}`);
      client.disconnect();
      return;
    }
    this.logger.log(`Client connected: ${result.id}, ${result.login}`);
    client.user = result;
    this.eventsService.registerSocket(result.id, client);
  }
}

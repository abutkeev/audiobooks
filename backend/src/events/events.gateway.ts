import { Logger, UsePipes } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { EventsService } from './events.service';
import { PositionDto } from '../position/dto/position.dto';
import { EventsAuthValidationPipe, SocketWithUser } from './events-auth-validation.pipe';
import { PositionService } from 'src/position/position.service';
import { verboseValidationPipeInstance } from './verbose-validation.pipe';

@UsePipes(verboseValidationPipeInstance, new EventsAuthValidationPipe())
@WebSocketGateway({ namespace: 'api/events' })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('Events gateway');

  constructor(
    private authService: AuthService,
    private eventsService: EventsService,
    private positionService: PositionService
  ) {}

  @SubscribeMessage('log')
  handleLog(client: SocketWithUser, payload: unknown) {
    this.logger.log(client.user, payload);
  }

  @SubscribeMessage('position_update')
  async handlePositionUpdate(
    @ConnectedSocket() { user, instanceId }: SocketWithUser,
    @MessageBody() payload: PositionDto
  ) {
    this.positionService
      .savePosition(user.id, instanceId, payload)
      .then(() => this.logger.log(`position updated for user ${user.id}, instance ${instanceId}`));
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
    this.eventsService.sendOutdatedTokenRefreshEvent(token, client);
  }
}

import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class EventsService {
  private static sockets: Record<string, { instanceId: string; socket: Socket }[]> = {};
  private logger = new Logger('Events service');

  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,

    @Inject(forwardRef(() => AuthService))
    private authService: AuthService
  ) {}

  registerSocket(userId: string, instanceId: string, socket: Socket) {
    if (!EventsService.sockets[userId]) {
      EventsService.sockets[userId] = [];
    }
    EventsService.sockets[userId].push({ socket, instanceId });
  }

  unregisterSocket(userId: string, socket: Socket) {
    if (!EventsService.sockets[userId]) return;

    EventsService.sockets[userId] = EventsService.sockets[userId].filter(({ socket: { id } }) => socket.id !== id);
  }

  sendToUser({
    userId,
    skipInstance,
    message,
    args,
  }: {
    userId: string;
    skipInstance?: string;
    message: 'invalidate_tag' | 'refresh_token';
    args?: any;
  }) {
    const userSockets = EventsService.sockets[userId];
    if (!userSockets) return;
    for (const { instanceId, socket } of userSockets) {
      if (instanceId === skipInstance) continue;
      this.logger.log(`Sending message ${message}(${JSON.stringify(args)}) to ${userId}(${instanceId})`);
      socket.emit(message, args);
    }
  }

  sendAll({ message, args }: { message: 'invalidate_tag' | 'refresh_token'; args?: any }) {
    for (const [userId, sockets] of Object.entries(EventsService.sockets)) {
      for (const { instanceId, socket } of sockets) {
        this.logger.log(`Sending message ${message}(${JSON.stringify(args)}) to ${userId}(${instanceId})`);
        socket.emit(message, args);
      }
    }
  }

  async sendToAdmins({ message, args }: { message: 'invalidate_tag' | 'refresh_token'; args?: any }) {
    for (const userId of Object.keys(EventsService.sockets)) {
      const { admin } = await this.usersService.find(userId);
      if (!admin) continue;
      this.sendToUser({ userId, message, args });
    }
  }

  async sendOutdatedTokenRefreshEvent(token: string, socket: Socket) {
    const info = this.authService.getTokenInfo(token);
    const { online: _, telegram: __, ...user } = await this.usersService.find(info.id);

    if (!user || JSON.stringify(Object.entries(info).sort()) !== JSON.stringify(Object.entries(user).sort())) {
      this.logger.log(`Token for ${info.login} is outdated`);
      socket.emit('refresh_token');
    }
  }
}

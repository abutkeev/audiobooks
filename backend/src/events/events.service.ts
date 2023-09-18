import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class EventsService {
  private static sockets: Record<string, { instanceId: string; socket: Socket }[]> = {};
  private logger = new Logger('Events service');

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
    message: string;
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
}

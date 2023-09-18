import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class EventsService {
  private sockets: Record<string, { instanceId: string; socket: Socket }[]> = {};

  registerSocket(userId: string, instanceId: string, socket: Socket) {
    if (!this.sockets[userId]) {
      this.sockets[userId] = [];
    }
    this.sockets[userId].push({ socket, instanceId });
  }

  unregisterSocket(userId: string, socket: Socket) {
    if (!this.sockets[userId]) return;

    this.sockets[userId] = this.sockets[userId].filter(({ socket: { id } }) => socket.id !== id);
  }
}

import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class EventsService {
  private sockets: Record<string, Socket[]> = {};

  registerSocket(userId: string, socket: Socket) {
    if (!this.sockets[userId]) {
      this.sockets[userId] = [];
    }
    this.sockets[userId].push(socket);
  }

  unregisterSocket(userId: string, socket: Socket) {
    if (!this.sockets[userId]) return;

    this.sockets[userId] = this.sockets[userId].filter(({ id }) => socket.id !== id);
  }
}

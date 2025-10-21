import { Server as SocketIOServer } from 'socket.io';

export class SocketManager {
  private io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupListeners();
  }

  private setupListeners() {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });

      socket.on('chat:message', (data) => {
        console.log('Chat message received:', data);
      });
    });
  }

  public broadcastMessage(event: string, data: any) {
    this.io.emit(event, data);
  }
}
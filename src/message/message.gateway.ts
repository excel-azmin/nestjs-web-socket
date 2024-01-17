import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';

@WebSocketGateway()
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Socket;

  constructor(private readonly messageService: MessageService) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Client connected: ${client.id}`);
    const userId = client.handshake.query.userId;
    console.log(userId);
    const previousMessage = await this.messageService.findOne(String(userId));

    this.server.emit('message', { previousMessage });
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    console.log(createMessageDto);
    const previousMessage = await this.messageService.findOne(
      createMessageDto.senderId,
    );

    this.server.emit('message', { previousMessage });

    return this.messageService.create(createMessageDto);
  }

  @SubscribeMessage('findAllMessage')
  findAll(@MessageBody() id: string) {
    return this.messageService.findAll(id);
  }

  @SubscribeMessage('findOneMessage')
  findOne(@MessageBody() id: string) {
    return this.messageService.findOne(id);
  }
}

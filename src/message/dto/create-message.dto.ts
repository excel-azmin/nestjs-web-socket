export class CreateMessageDto {
  readonly senderId: string;
  readonly receiverId: string;
  readonly text: string;
}

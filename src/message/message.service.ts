import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}
  async create(createMessageDto: CreateMessageDto) {
    return await new this.messageModel(createMessageDto).save();
  }

  async findAll(id: string) {
    return await this.messageModel
      .find({
        senderId: id,
      })
      .populate('receiverId')
      .populate('senderId');
  }

  async findOne(id: string) {
    return await this.messageModel.find({
      $or: [{ senderId: id }, { receiverId: id }],
    });
  }
}

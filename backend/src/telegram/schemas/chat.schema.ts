import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class Chat {
  @Prop({ required: true, index: true, unique: true })
  id: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: false, default: false })
  authorized: boolean;
}

export const ChatsSchema = SchemaFactory.createForClass(Chat);

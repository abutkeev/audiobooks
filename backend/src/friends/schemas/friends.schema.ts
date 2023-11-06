import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Schema()
export class Friend {
  @Prop({ ref: User.name })
  user1: mongoose.Schema.Types.ObjectId;

  @Prop({ ref: User.name })
  user2: mongoose.Schema.Types.ObjectId;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);

FriendSchema.index({ user1: 1, user2: 1 }, { unique: true });

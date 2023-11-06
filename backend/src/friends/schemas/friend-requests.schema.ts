import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Schema()
export class FriendRequests {
  @Prop({ ref: User.name })
  from: mongoose.Schema.Types.ObjectId;

  @Prop({ ref: User.name })
  to: mongoose.Schema.Types.ObjectId;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequests);

FriendRequestSchema.index({ from: 1, to: 1 }, { unique: true });

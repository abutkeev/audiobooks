import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Schema()
export class Position {
  @Prop({ ref: User.name })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  instanceId: string;

  @Prop()
  bookId: string;

  @Prop()
  currentChapter: number;

  @Prop()
  position: number;

  @Prop()
  updated: Date;
}

export const PositionSchema = SchemaFactory.createForClass(Position);

PositionSchema.index({ userId: 1, instanceId: 1, bookId: 1 }, { unique: true });

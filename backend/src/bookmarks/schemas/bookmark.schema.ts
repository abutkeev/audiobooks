import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Schema({
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.userId;
    },
  },
})
export class Bookmark {
  @Prop({ ref: User.name })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  bookId: string;

  @Prop()
  name: string;

  @Prop()
  currentChapter: number;

  @Prop()
  position: number;

  @Prop()
  updated: Date;
}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);

BookmarkSchema.index({ userId: 1, bookId: 1 });

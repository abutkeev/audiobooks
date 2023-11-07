import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Schema({
  toJSON: {
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class TelegramAccount {
  @ApiProperty()
  @Prop({ index: true, unique: true, isRequired: true })
  id: number;

  @ApiProperty({ type: 'string' })
  @Prop({ ref: User.name, index: true, unique: true, isRequired: true })
  userId: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  @Prop({ isRequired: true })
  first_name: string;

  @ApiProperty()
  @Prop()
  last_name?: string;

  @ApiProperty()
  @Prop()
  username?: string;

  @ApiProperty()
  @Prop()
  photo_url?: string;
}

export const TelegramAccountsSchema = SchemaFactory.createForClass(TelegramAccount);

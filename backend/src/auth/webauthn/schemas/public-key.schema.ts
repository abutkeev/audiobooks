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
export class PublicKey {
  @ApiProperty()
  @Prop({ index: true, unique: true, isRequired: true })
  id: string;

  @ApiProperty({ type: 'string' })
  @Prop({ ref: User.name })
  userId: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop({ isRequired: true })
  publicKey: string;

  @ApiProperty()
  @Prop({ isRequired: true })
  algorithm: string;
}

export const PublicKeySchema = SchemaFactory.createForClass(PublicKey);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
export class Settings {
  @Prop({ ref: User.name, index: true, unique: true, isRequired: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  language: string;

  @Prop()
  theme: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);

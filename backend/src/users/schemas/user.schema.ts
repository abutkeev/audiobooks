import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      if (!ret.name) {
        ret.name = '';
      }
      ret.admin = !!ret.admin;
      ret.enabled = !!ret.enabled;

      delete ret.password;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class User {
  @Prop()
  login: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop()
  enabled: boolean;

  @Prop()
  admin: boolean;

  @Prop({ isRequired: false })
  online: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ login: 1 }, { unique: true });

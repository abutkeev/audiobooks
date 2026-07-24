import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Challenge {
  @Prop({ index: true, unique: true, isRequired: true })
  challenge: string;

  // TTL index: mongo drops the document ~5 minutes after creation, so a
  // challenge that is never used to finish the ceremony cleans itself up.
  @Prop({ type: Date, default: Date.now, expires: 300 })
  createdAt: Date;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);

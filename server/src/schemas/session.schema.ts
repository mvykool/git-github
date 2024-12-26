import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Session extends Document {
  @Prop()
  file_type: string;

  @Prop()
  start_time: Date;

  @Prop()
  end_time: Date;

  @Prop()
  duration: number;

  @Prop()
  date: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

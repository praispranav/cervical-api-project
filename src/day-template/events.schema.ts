import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventsDocument = Events & Document;

@Schema()
export class Events {
  @Prop({ type: String })
  heading: string;

  @Prop({ type: String })
  subHeading: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: Date })
  eventDate: Date;

  @Prop({ type: Date, default: new Date() })
  timestamp: Date;
}

export const EventsSchema = SchemaFactory.createForClass(Events);

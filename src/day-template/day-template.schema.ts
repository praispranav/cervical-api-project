import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DayTemplateDocument = DayTemplate & Document;

@Schema()
export class DayTemplate {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  radioButtonText: string;

  @Prop({ type: String })
  file: string;

  @Prop({ type: Object })
  nameCoordinate: {
    x: number;
    y: number;
  };

  @Prop({ type: Object })
  dateTimeCoordinate: {
    x: number;
    y: number;
  };

  @Prop({ type: Date, default: new Date() })
  timestamp: Date;
}

export const DayTemplateSchema = SchemaFactory.createForClass(DayTemplate);

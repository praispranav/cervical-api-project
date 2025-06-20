import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SliderDocument = Slider & Document;

@Schema()
export class Slider {
  @Prop({ type: String })
  heading: string;

  @Prop({ type: String })
  subHeading: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: String })
  imageCaption: string;

  @Prop({ type: Number })
  order: number;

  @Prop({ type: Boolean })
  showButton: boolean;

  @Prop({ type: String })
  buttonText: string;

  @Prop({ type: String })
  buttonLink: string;

  @Prop({ type: Date, default: new Date() })
  timestamp: Date;
}

export const SliderSchema = SchemaFactory.createForClass(Slider);

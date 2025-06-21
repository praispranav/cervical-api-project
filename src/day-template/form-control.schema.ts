import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FormControlDocument = FormControl & Document;

@Schema()
export class FormControl {
  @Prop({ type: String })
  formOpenerButtonText: string;

  @Prop({ type: String })
  formTitle: string;

  @Prop({ type: Boolean })
  showNameField: boolean;

  @Prop({ type: Boolean })
  showPhoneField: boolean;

  @Prop({ type: Boolean })
  showCityField: boolean;

  @Prop({ type: Boolean })
  showEmailField: boolean;

  @Prop({ type: [String] })
  eventRadioBtns: string[]; // store only active templates. Mean switch is turned on only store those

  @Prop({ type: String })
  submitButtonText: string;

  @Prop({ type: String })
  submitButtonColor: string;

  @Prop({ type: Date, default: new Date() })
  timestamp: Date;
}

export const FormControlSchema = SchemaFactory.createForClass(FormControl);

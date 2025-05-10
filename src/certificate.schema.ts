import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CertificateDocument = Certificate & Document;

export enum DeviceType {
    Mobile = 'Mobile',
    Desktop = 'Desktop',
}

@Schema()
export class Certificate {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  email: string;
  
  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  city: string;

  @Prop({ type: String, enum: Object.values(DeviceType) })
  deviceType: string;

  @Prop({ type: String, required: false })
  certificateType: string;

  @Prop({ type: Date, default: new Date() })
  timestamp: Date;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
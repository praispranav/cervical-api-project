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
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
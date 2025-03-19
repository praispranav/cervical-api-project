import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Certificate, CertificateDocument } from './certificate.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Certificate.name) private certificate: Model<CertificateDocument>,
  ) {

  }

  async createCertificate(data: Certificate) {
    try{
      return await this.certificate.create(data);
    } catch(error){
      return
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}

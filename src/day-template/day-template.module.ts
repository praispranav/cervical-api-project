import { Module } from '@nestjs/common';
import { DayTemplateController } from './day-template.controller';
import { DayTemplateService } from './day-template.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Slider, SliderSchema } from './slider.schema';
import { CloudinaryService } from './cloudinary.service';
import { DayTemplate, DayTemplateSchema } from './day-template.schema';
import { AppService } from 'src/app.service';
import { Certificate, CertificateSchema } from 'src/certificate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Slider.name,
        schema: SliderSchema,
      },
      {
        name: DayTemplate.name,
        schema: DayTemplateSchema,
      },
      {
        name: Certificate.name,
        schema: CertificateSchema,
      },
    ]),
  ],
  controllers: [DayTemplateController],
  providers: [DayTemplateService, CloudinaryService, AppService],
})
export class DayTemplateModule {}

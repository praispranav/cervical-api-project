import { Module } from '@nestjs/common';
import { DayTemplateController } from './day-template.controller';
import { DayTemplateService } from './day-template.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Slider, SliderSchema } from './slider.schema';
import { CloudinaryService } from './cloudinary.service';
import { DayTemplate, DayTemplateSchema } from './day-template.schema';

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
    ]),
  ],
  controllers: [DayTemplateController],
  providers: [DayTemplateService, CloudinaryService],
})
export class DayTemplateModule {}

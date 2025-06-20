import { HttpException, HttpStatus, Injectable, Patch } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Slider, SliderDocument } from './slider.schema';
import { Model } from 'mongoose';
import { DayTemplate, DayTemplateDocument } from './day-template.schema';

@Injectable()
export class DayTemplateService {
  constructor(
    @InjectModel(Slider.name)
    private readonly sliderModel: Model<SliderDocument>,
    @InjectModel(DayTemplate.name)
    private readonly dayTemplate: Model<DayTemplateDocument>,
  ) {}

  async getSlides() {
    return this.sliderModel.find();
  }

  async addSlider(body) {
    try {
      await this.sliderModel.create(body);
      return { message: 'Added SUccessfully', success: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteSlider(id) {
    await this.sliderModel.deleteOne(id);
    return { message: 'Deleted SUccessfully' };
  }

  async updateSlider(body) {
    try {
      const payload = { ...body };
      delete payload._id;
      console.log(payload);
      await this.sliderModel.updateOne({ _id: body._id }, { $set: payload });
      return { message: 'Update SUccessfully', success: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async addTemplate(body) {
    try {
      await this.dayTemplate.create(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteTemplate(id) {
    try {
      await this.dayTemplate.deleteOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateTemplate(body) {
    try {
      const payload = { ...body };
      delete payload._id;
      console.log(payload);
      await this.dayTemplate.updateOne({ _id: body._id }, { $set: payload });
      return { message: 'Update SUccessfully', success: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getTemplates() {
    return this.dayTemplate.find();
  }
}

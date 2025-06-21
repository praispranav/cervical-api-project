import { HttpException, HttpStatus, Injectable, Patch } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Slider, SliderDocument } from './slider.schema';
import { Model } from 'mongoose';
import { DayTemplate, DayTemplateDocument } from './day-template.schema';
import * as moment from 'moment';

import * as fs from 'fs';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';
import { v4 } from 'uuid';
import { DeviceType } from '../certificate.schema';
import { AppService } from 'src/app.service';

@Injectable()
export class DayTemplateService {
  constructor(
    @InjectModel(Slider.name)
    private readonly sliderModel: Model<SliderDocument>,
    @InjectModel(DayTemplate.name)
    private readonly dayTemplate: Model<DayTemplateDocument>,
    private appService: AppService,
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

  async generateCertificate({ templateId, city, phone, name, email, res }) {
    const template = await this.dayTemplate.findById(templateId);
    if (!template)
      throw new HttpException('Template not found', HttpStatus.BAD_REQUEST);

    if (!name) {
      throw new HttpException('Name is required', HttpStatus.BAD_REQUEST);
    }

    try {
      this.appService.createCertificate({
        certificateType: template.name,
        deviceType: DeviceType.Desktop,
        name,
        email,
        phone,
        city,
        timestamp: new Date(),
      });
    } catch (error) {}

    function formatName(name) {
      return name
        .toLowerCase() // Convert everything to lowercase
        .split(' ') // Split by space
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
        .join(' '); // Join words back together
    }

    name = formatName(name);

    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
    });

    doc.pipe(res);

    try {
      doc.image('./templates/' + template.file, 0, 0, {
        width: 842,
        height: 595,
      });

      const fontBuffer = fs.readFileSync('./Boldonse-Regular.ttf');
      doc
        .font(fontBuffer)
        .fontSize(25)
        .fillColor('black')
        .text(name, template.nameCoordinate.x, template.nameCoordinate.y, {
          align: 'center',
        });

      const fontBuffer2 = fs.readFileSync('./Montserrat-SemiBold.ttf');
      const a = moment(new Date()).format('MMMM Do, YYYY');
      doc
        .font(fontBuffer2)
        .fontSize(15)
        .fillColor('black')
        .text(
          city + ', ' + a,
          template.dateTimeCoordinate.x,
          template.dateTimeCoordinate.y,
          { align: 'center' },
        );

      doc.end();
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new HttpException(
        'Failed to generate PDF',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateCertificateMobile({
    templateId,
    city,
    phone,
    name,
    email,
    res,
  }) {
    const template = await this.dayTemplate.findById(templateId);
    if (!template)
      throw new HttpException('Template not found', HttpStatus.BAD_REQUEST);

    if (!name) {
      throw new HttpException('Name is required', HttpStatus.BAD_REQUEST);
    }

    try {
      this.appService.createCertificate({
        certificateType: template.name,
        deviceType: DeviceType.Mobile,
        name,
        email,
        phone,
        city,
        timestamp: new Date(),
      });
    } catch (error) {}

    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    const outputFilePath = path.join(process.cwd(), `certificate_${name}.pdf`);
    const stream = fs.createWriteStream(outputFilePath);

    doc.pipe(stream);
    doc.image('./templates/' + template.file, 0, 0, {
      width: 842,
      height: 595,
    });

    function formatName(inputName: string): string {
      return inputName
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    const formattedName = formatName(name);

    const fontBuffer = fs.readFileSync('./Boldonse-Regular.ttf');
    doc
      .font(fontBuffer)
      .fontSize(25)
      .fillColor('black')
      .text(
        formattedName,
        template.nameCoordinate.x,
        template.nameCoordinate.y,
        { align: 'center' },
      );

    const fontBuffer2 = fs.readFileSync('./Montserrat-SemiBold.ttf');
    const a = moment(new Date()).format('MMMM Do, YYYY');
    doc
      .font(fontBuffer2)
      .fontSize(15)
      .fillColor('black')
      .text(
        city + ', ' + a,
        template.dateTimeCoordinate.x,
        template.dateTimeCoordinate.y,
        { align: 'center' },
      );

    doc.end();

    stream.on('finish', () => {
      res.download(outputFilePath, `certificate_${name}.pdf`, (err) => {
        if (err) {
          console.error('Download error:', err);
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send('Error downloading file');
        }
        fs.unlinkSync(outputFilePath);
      });
    });
  }
}

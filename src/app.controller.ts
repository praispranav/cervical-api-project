import {
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { v4 } from 'uuid';
import * as moment from 'moment';
import { DeviceType } from './certificate.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('generate-certificate')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'inline; filename=certificate.pdf')
  async generateCertificate(
    @Res() res: Response,
    @Query('name') name: string = '',
    @Query('email') email: string = '',
    @Query('phone') phone: string = '',
    @Query('city') city: string = '',
    @Query('additionalText') additionalText: string = '',
  ) {
    if (!name) {
      throw new HttpException('Name is required', HttpStatus.BAD_REQUEST);
    }
    try {
      this.appService.createCertificate({
        certificateType: 'cervical',
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
      doc.image(path.join(__dirname, '..', 'certificate_cervical.jpeg'), 0, 0, {
        width: 842,
        height: 595,
      });

      const fontBuffer = fs.readFileSync(
        path.join(__dirname, '..', 'Boldonse-Regular.ttf'),
      );
      doc
        .font(fontBuffer)
        .fontSize(25)
        .fillColor('black')
        .text(name, 80, 265, { align: 'center' });

      const fontBuffer2 = fs.readFileSync(
        path.join(__dirname, '..', 'Montserrat-SemiBold.ttf'),
      );
      const a = moment(new Date()).format('MMMM Do, YYYY');
      doc
        .font(fontBuffer2)
        .fontSize(15)
        .fillColor('black')
        .text(city + ', ' + a, 80, 468, { align: 'center' });

      if (additionalText) {
        doc
          .fontSize(18)
          .fillColor('red')
          .text(additionalText, 80, 295, { align: 'center' });
      }

      doc.end();
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new HttpException(
        'Failed to generate PDF',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('generate-certificate-mobile')
  async generateCertificateMobile(
    @Query('name') name: string,
    @Query('additionalText') additionalText: string,
    @Query('email') email: string,
    @Query('city') city: string,
    @Query('phone') phone: string,
    @Res() res: Response,
  ) {
    if (!name) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Name is required' });
    }

    try {
      this.appService.createCertificate({
        certificateType: 'cervical',
        deviceType: DeviceType.Mobile,
        name,
        email,
        phone,
        city,
        timestamp: new Date(),
      });
    } catch (error) {}

    try {
      fs.writeFileSync(
        path.join(process.cwd(), 'certificates', `${v4()}.json`),
        JSON.stringify({ name, email, phone, city }),
      );
    } catch (error) {
      console.error('Error writing JSON:', error);
    }

    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    const outputFilePath = path.join(process.cwd(), `certificate_${name}.pdf`);
    const stream = fs.createWriteStream(outputFilePath);

    doc.pipe(stream);
    doc.image(path.join(process.cwd(), 'certificate_cervical.jpeg'), 0, 0, {
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

    const fontBuffer = fs.readFileSync(
      path.join(__dirname, '..', 'Boldonse-Regular.ttf'),
    );
    doc
      .font(fontBuffer)
      .fontSize(25)
      .fillColor('black')
      .text(formattedName, 80, 264, { align: 'center' });

    const fontBuffer2 = fs.readFileSync(
      path.join(__dirname, '..', 'Montserrat-SemiBold.ttf'),
    );
    const a = moment(new Date()).format('MMMM Do, YYYY');
    doc
      .font(fontBuffer2)
      .fontSize(15)
      .fillColor('black')
      .text(city + ', ' + a, 80, 468, { align: 'center' });

    if (additionalText) {
      doc
        .fontSize(18)
        .fillColor('red')
        .text(additionalText, 80, 295, { align: 'center' });
    }
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

  @Get('generate-certificate-mothers-day')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'inline; filename=certificate.pdf')
  async generateCertificateMothersDay(
    @Res() res: Response,
    @Query('name') name: string = '',
    @Query('email') email: string = '',
    @Query('phone') phone: string = '',
    @Query('city') city: string = '',
    @Query('additionalText') additionalText: string = '',
  ) {
    if (!name) {
      throw new HttpException('Name is required', HttpStatus.BAD_REQUEST);
    }
    try {
      this.appService.createCertificate({
        certificateType: 'mothersDay',
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
      doc.image(
        path.join(__dirname, '..', 'mother_day_certificate.jpg'),
        0,
        0,
        {
          width: 842,
          height: 595,
        },
      );

      const fontBuffer = fs.readFileSync(
        path.join(__dirname, '..', 'Boldonse-Regular.ttf'),
      );
      doc
        .font(fontBuffer)
        .fontSize(25)
        .fillColor('black')
        .text(name, 80, 335, { align: 'center' });

      const fontBuffer2 = fs.readFileSync(
        path.join(__dirname, '..', 'Montserrat-SemiBold.ttf'),
      );
      const a = moment(new Date()).format('MMMM Do, YYYY');
      doc
        .font(fontBuffer2)
        .fontSize(15)
        .fillColor('black')
        .text(city + ', ' + a, 80, 458, { align: 'center' });

      if (additionalText) {
        doc
          .fontSize(18)
          .fillColor('red')
          .text(additionalText, 80, 295, { align: 'center' });
      }

      doc.end();
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new HttpException(
        'Failed to generate PDF',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('generate-certificate-mothers-day-mobile')
  async generateCertificateMothersDayMobile(
    @Query('name') name: string,
    @Query('additionalText') additionalText: string,
    @Query('email') email: string,
    @Query('city') city: string,
    @Query('phone') phone: string,
    @Res() res: Response,
  ) {
    if (!name) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Name is required' });
    }

    try {
      this.appService.createCertificate({
        deviceType: DeviceType.Mobile,
        name,
        email,
        certificateType: 'mothersDay',
        phone,
        city,
        timestamp: new Date(),
      });
    } catch (error) {}

    try {
      fs.writeFileSync(
        path.join(process.cwd(), 'certificates', `${v4()}.json`),
        JSON.stringify({ name, email, phone, city }),
      );
    } catch (error) {
      console.error('Error writing JSON:', error);
    }

    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    const outputFilePath = path.join(process.cwd(), `certificate_${name}.pdf`);
    const stream = fs.createWriteStream(outputFilePath);

    doc.pipe(stream);
    doc.image(path.join(process.cwd(), 'mother_day_certificate.jpg'), 0, 0, {
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

    const fontBuffer = fs.readFileSync(
      path.join(__dirname, '..', 'Boldonse-Regular.ttf'),
    );
    doc
      .font(fontBuffer)
      .fontSize(25)
      .fillColor('black')
      .text(formattedName, 80, 335, { align: 'center' });

    const fontBuffer2 = fs.readFileSync(
      path.join(__dirname, '..', 'Montserrat-SemiBold.ttf'),
    );
    const a = moment(new Date()).format('MMMM Do, YYYY');
    doc
      .font(fontBuffer2)
      .fontSize(15)
      .fillColor('black')
      .text(city + ', ' + a, 80, 458, { align: 'center' });

    if (additionalText) {
      doc
        .fontSize(18)
        .fillColor('red')
        .text(additionalText, 80, 295, { align: 'center' });
    }
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

  @Get('generate-certificate-elder-abuse')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'inline; filename=certificate.pdf')
  async generateCertificateElderAbuse(
    @Res() res: Response,
    @Query('name') name: string = '',
    @Query('email') email: string = '',
    @Query('phone') phone: string = '',
    @Query('city') city: string = '',
    @Query('additionalText') additionalText: string = '',
  ) {
    if (!name) {
      throw new HttpException('Name is required', HttpStatus.BAD_REQUEST);
    }
    try {
      this.appService.createCertificate({
        certificateType: 'elderAbuse',
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
      doc.image(
        path.join(__dirname, '..', 'vishuniti_elder.jpeg'),
        0,
        0,
        {
          width: 842,
          height: 595,
        },
      );

      const fontBuffer = fs.readFileSync(
        path.join(__dirname, '..', 'Boldonse-Regular.ttf'),
      );
      doc
        .font(fontBuffer)
        .fontSize(22)
        .fillColor('black')
        .text(name, 66,291, { align: 'center' });

      const fontBuffer2 = fs.readFileSync(
        path.join(__dirname, '..', 'Montserrat-SemiBold.ttf'),
      );
      const a = moment(new Date()).format('MMMM Do, YYYY');
      doc
        .font(fontBuffer2)
        .fontSize(15)
        .fillColor('black')
        .text(city + ', ' + a, 80, 466, { align: 'center' });

      if (additionalText) {
        doc
          .fontSize(18)
          .fillColor('red')
          .text(additionalText, 80, 295, { align: 'center' });
      }

      doc.end();
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new HttpException(
        'Failed to generate PDF',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('generate-certificate-elder-abuse-mobile')
  async generateCertificateElderAbuseMobile(
    @Query('name') name: string,
    @Query('additionalText') additionalText: string,
    @Query('email') email: string,
    @Query('city') city: string,
    @Query('phone') phone: string,
    @Res() res: Response,
  ) {
    if (!name) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Name is required' });
    }

    try {
      this.appService.createCertificate({
        deviceType: DeviceType.Mobile,
        name,
        email,
        certificateType: 'mothersDay',
        phone,
        city,
        timestamp: new Date(),
      });
    } catch (error) {}

    try {
      fs.writeFileSync(
        path.join(process.cwd(), 'certificates', `${v4()}.json`),
        JSON.stringify({ name, email, phone, city }),
      );
    } catch (error) {
      console.error('Error writing JSON:', error);
    }

    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    const outputFilePath = path.join(process.cwd(), `certificate_${name}.pdf`);
    const stream = fs.createWriteStream(outputFilePath);

    doc.pipe(stream);
    doc.image(path.join(process.cwd(), 'vishuniti_elder.jpeg'), 0, 0, {
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

    const fontBuffer = fs.readFileSync(
      path.join(__dirname, '..', 'Boldonse-Regular.ttf'),
    );
    doc
      .font(fontBuffer)
      .fontSize(22)
      .fillColor('black')
      .text(formattedName, 66, 291, { align: 'center' });

    const fontBuffer2 = fs.readFileSync(
      path.join(__dirname, '..', 'Montserrat-SemiBold.ttf'),
    );
    const a = moment(new Date()).format('MMMM Do, YYYY');
    doc
      .font(fontBuffer2)
      .fontSize(15)
      .fillColor('black')
      .text(city + ', ' + a, 80, 466, { align: 'center' });

    if (additionalText) {
      doc
        .fontSize(18)
        .fillColor('red')
        .text(additionalText, 80, 295, { align: 'center' });
    }
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

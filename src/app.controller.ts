import { Controller, Get, Header, HttpException, HttpStatus, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import {v4 } from "uuid"
import * as moment from "moment"

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('generate-certificate')
  @Header('Content-Type', 'application/pdf')
  // @Header('Content-Disposition', 'inline; filename=certificate.pdf')
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
    try{
      fs.writeFileSync('./certificates/' + v4() + '.json', JSON.stringify({ name, email, phone, city }));
    } catch(error){}

    function formatName(name) {
      return name
          .toLowerCase() // Convert everything to lowercase
          .split(' ') // Split by space
          .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
          .join(' '); // Join words back together
  }
  
  // Example usage:
      name = formatName(name);
  

    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
    });

    doc.pipe(res);

    try {
      doc.image(path.join(__dirname, '..', 'certificate.jpeg'), 0, 0, { width: 842, height: 595 });

      const fontBuffer = fs.readFileSync(path.join(__dirname, '..', 'GreatVibes-Regular.ttf'));
      doc.font(fontBuffer).fontSize(24).fillColor('black').text(name, 80, 275, { align: 'center' });
      
      const fontBuffer2 = fs.readFileSync(path.join(__dirname, '..', 'Montserrat-Regular.ttf'));
      const a = moment(new Date()).format('DD-MM-YYYY')
      doc.font(fontBuffer2).fontSize(15).fillColor('black').text(a, 80, 468, { align: 'center' });

      if (additionalText) {
        doc.fontSize(18).fillColor('red').text(additionalText, 80, 295, { align: 'center' });
      }

      doc.end();
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new HttpException('Failed to generate PDF', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

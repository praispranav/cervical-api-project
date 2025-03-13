import { Controller, Get, Header, HttpException, HttpStatus, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('generate-certificate')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'inline; filename=certificate.pdf')
  async generateCertificate(
    @Res() res: Response,
    @Query('name') name: string = 'John Doe',
    @Query('additionalText') additionalText: string = '',
  ) {
    if (!name) {
      throw new HttpException('Name is required', HttpStatus.BAD_REQUEST);
    }

    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
    });

    doc.pipe(res);

    try {
      doc.image(path.join(__dirname, '..', 'certificate.jpeg'), 0, 0, { width: 842, height: 595 });

      const fontBuffer = fs.readFileSync(path.join(__dirname, '..', 'Montserrat-Regular.ttf'));
      doc.font(fontBuffer).fontSize(24).fillColor('black').text(name, 80, 280, { align: 'center' });

      if (additionalText) {
        doc.fontSize(18).fillColor('red').text(additionalText, 80, 320, { align: 'center' });
      }

      doc.end();
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new HttpException('Failed to generate PDF', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

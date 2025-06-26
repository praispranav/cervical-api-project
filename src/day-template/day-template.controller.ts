import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DayTemplateService } from './day-template.service';
import { Response } from 'express';
import { AppKeyGuard } from 'src/api-key.guard';
@Controller('day-template')
export class DayTemplateController {
  constructor(private dayTemplateService: DayTemplateService) {}

  // File upload endpoint

  @UseGuards(AppKeyGuard)
  @Post('upload/local')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now();
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { filename: file.filename };
  }

  @UseGuards(AppKeyGuard)
  @Post('upload/template')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './templates',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now();
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  uploadFileTemplate(@UploadedFile() file: Express.Multer.File) {
    return { filename: file.filename };
  }

  @Get('get-slide')
  async getSlides() {
    return await this.dayTemplateService.getSlides();
  }

  @UseGuards(AppKeyGuard)
  @Post('add-slide')
  async addSlide(@Body() body) {
    return await this.dayTemplateService.addSlider(body);
  }

  @UseGuards(AppKeyGuard)
  @Delete('delete-slider')
  async deleteSlider(@Query('id') id: string) {
    return await this.dayTemplateService.deleteSlider(id);
  }

  @UseGuards(AppKeyGuard)
  @Patch('update-slider')
  async updateSlider(@Body() body: any) {
    return await this.dayTemplateService.updateSlider(body);
  }

  @UseGuards(AppKeyGuard)
  @Post('add-template')
  async addTemplate(@Body() body: any) {
    return await this.dayTemplateService.addTemplate(body);
  }

  @UseGuards(AppKeyGuard)
  @Patch('update-template')
  async updateTemplate(@Body() body: any) {
    return await this.dayTemplateService.updateTemplate(body);
  }

  @UseGuards(AppKeyGuard)
  @Delete('delete-template')
  async deleteTemplate(@Query('id') id: string) {
    return await this.dayTemplateService.deleteTemplate(id);
  }

  @Get('get-template')
  async getTemplate() {
    return await this.dayTemplateService.getTemplates();
  }

  //    get Get Certificate According to radio button selected
  @Get('get-certificate')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'inline; filename=certificate.pdf')
  async getCertificate(
    @Res() res: Response,
    @Query('name') name: string = '',
    @Query('email') email: string = '',
    @Query('phone') phone: string = '',
    @Query('city') city: string = '',
    @Query('templateId') templateId: string = '',
  ) {
    return await this.dayTemplateService.generateCertificate({
      res,
      name,
      email,
      phone,
      city,
      templateId,
    });
  }

  @Get('get-certificate-mobile')
  async getCertificateMobile(
    @Res() res: Response,
    @Query('name') name: string = '',
    @Query('email') email: string = '',
    @Query('phone') phone: string = '',
    @Query('city') city: string = '',
    @Query('templateId') templateId: string = '',
  ) {
    return await this.dayTemplateService.generateCertificateMobile({
      res,
      name,
      email,
      phone,
      city,
      templateId,
    });
  }

  @UseGuards(AppKeyGuard)
  @Post('create-form-control')
  async createFormControl(@Body() body: any) {
    return await this.dayTemplateService.createFormControl(body);
  }

  @Get('get-form-control')
  async getFormControl() {
    return await this.dayTemplateService.getFormControl();
  }

  @UseGuards(AppKeyGuard)
  @Patch('update-from-control')
  async updateFormControl(@Body() body: any) {
    return await this.dayTemplateService.updateFormControl(body);
  }

  @UseGuards(AppKeyGuard)
  @Post('create-event')
  createEvent(@Body() body) {
    return this.dayTemplateService.createEvents(body);
  }

  @UseGuards(AppKeyGuard)
  @Patch('update-event')
  updateEvent(@Body() body) {
    return this.dayTemplateService.editEvent(body);
  }

  @UseGuards(AppKeyGuard)
  @Delete('delete-event')
  deleteEvent(@Query('id') id) {
    return this.dayTemplateService.deleteEvent(id);
  }

  @Get('get-events')
  getEvents() {
    return this.dayTemplateService.getEvents();
  }
}

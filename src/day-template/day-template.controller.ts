import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DayTemplateService } from './day-template.service';
import { Response } from 'express';
@Controller('day-template')
export class DayTemplateController {
  constructor(private dayTemplateService: DayTemplateService) {}

  // File upload endpoint

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

  @Post('add-slide')
  async addSlide(@Body() body) {
    return await this.dayTemplateService.addSlider(body);
  }

  @Delete('delete-slider')
  async deleteSlider(@Query('id') id: string) {
    return await this.dayTemplateService.deleteSlider(id);
  }

  @Patch('update-slider')
  async updateSlider(@Body() body: any) {
    return await this.dayTemplateService.updateSlider(body);
  }

  @Post('add-template')
  async addTemplate(@Body() body: any) {
    return await this.dayTemplateService.addTemplate(body);
  }

  @Patch('update-template')
  async updateTemplate(@Body() body: any) {
    return await this.dayTemplateService.updateTemplate(body);
  }

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
}

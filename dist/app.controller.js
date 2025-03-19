"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async generateCertificate(res, name = '', additionalText = '') {
        if (!name) {
            throw new common_1.HttpException('Name is required', common_1.HttpStatus.BAD_REQUEST);
        }
        function formatName(name) {
            return name
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
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
            const a = moment(new Date()).format('DD-MM-YYYY');
            doc.font(fontBuffer2).fontSize(15).fillColor('black').text(a, 80, 468, { align: 'center' });
            if (additionalText) {
                doc.fontSize(18).fillColor('red').text(additionalText, 80, 295, { align: 'center' });
            }
            doc.end();
        }
        catch (error) {
            console.error('Error generating PDF:', error);
            throw new common_1.HttpException('Failed to generate PDF', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('generate-certificate'),
    (0, common_1.Header)('Content-Type', 'application/pdf'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('name')),
    __param(2, (0, common_1.Query)('additionalText')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "generateCertificate", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map
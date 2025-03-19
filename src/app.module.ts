import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { Certificate, CertificateSchema } from './certificate.schema';
require('dotenv').config();

console.log(process.env.DB);

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://praispranav12:Venus7874@cluster0.1zkx5.mongodb.net/', { dbName: 'cervical' }),
    MongooseModule.forFeature([{ name: Certificate.name, schema: CertificateSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        createProxyMiddleware({
          target: 'http://localhost:5005', // Replace with your Express server's address
          changeOrigin: true, // For virtual hosted sites
          pathRewrite: {
            '^/express-api': '', // Remove the prefix from the request
          },
        }),
      )
      .forRoutes('/express-api/*'); // Route prefix that triggers proxy
  }
}

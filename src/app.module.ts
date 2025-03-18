import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Module({
  imports: [],
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

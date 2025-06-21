import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['api-key'] || req.query.apiKey;

    if (!apiKey || apiKey !== process.env.API_KEY) {
      throw new UnauthorizedException('API key is missing or invalid');
    }

    next();
  }
}

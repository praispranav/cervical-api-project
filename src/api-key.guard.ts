import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AppKeyGuard implements CanActivate {
  private readonly validAppKey = process.env.API_KEY;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const appKey = request.headers['x-api-key'] as string;

    if (!appKey || appKey !== this.validAppKey) {
      throw new UnauthorizedException('Invalid or missing App Key');
    }

    return true;
  }
}

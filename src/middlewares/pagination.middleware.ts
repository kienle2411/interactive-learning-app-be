import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PaginationRequest } from 'src/interfaces/pagination-request.interface';

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  use(req: PaginationRequest, res: Response, next: NextFunction) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    req.pagination = { page, limit };
    next();
  }
}

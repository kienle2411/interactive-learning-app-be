import { Request } from 'express';

export interface PaginationRequest extends Request {
  pagination?: {
    page: number;
    limit: number;
  };
}

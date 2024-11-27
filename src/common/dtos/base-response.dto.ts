export class BaseResponseDto<T> {
  status: 'success' | 'error';
  statusCode: number;
  message?: string;
  data?: T | null;
  errors?: string[];
}

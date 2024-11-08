import { BadRequestException } from '@nestjs/common';
import { PaginatedResult, PaginationParams } from './pagination.types';

export class PaginationHelper {
  static async paginate<T>(
    prismaModel: any,
    where: any = {},
    options: PaginationParams = {},
    include: any = {},
  ): Promise<PaginatedResult<T>> {
    const page = options.page || 1;
    const limit = options.limit || 0;
    const skip = (page - 1) * limit;
    const hasCreatedAt =
      prismaModel.fields && prismaModel.fields.createdAt
        ? prismaModel.fields.createdAt.name === 'createdAt'
        : false;

    const [data, total] = await Promise.all([
      prismaModel.findMany({
        where,
        ...(limit > 0 ? { skip, take: limit } : {}),
        ...include,
        ...(hasCreatedAt && { orderBy: { createdAt: 'asc' } }),
      }),
      prismaModel.count({ where }),
    ]);

    const lastPage = limit > 0 ? Math.ceil(total / limit) : 1;

    if (page > lastPage && total > 0) {
      throw new BadRequestException(
        `Page ${page} does not exist. Total pages: ${lastPage}`,
      );
    }

    return {
      data,
      total,
      page,
      lastPage,
    };
  }
}

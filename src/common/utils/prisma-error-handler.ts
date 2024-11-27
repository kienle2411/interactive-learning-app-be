import { BadRequestException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handlePrismaError(error: any): void {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        const fields = error.meta?.target || [];
        throw new ConflictException(
          `The ${fields} you provided is already in use. Please use a different one`,
        );
      case 'P2003':
        throw new BadRequestException(`Foreign key`);
      case 'P2025':
      case 'P2000':
    }
  }
}

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { PaginationMiddleware } from 'src/middlewares/pagination.middleware';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [SessionsService, PrismaService],
  controllers: [SessionsController],
})
export class SessionsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationMiddleware).forRoutes(SessionsController);
  }
}

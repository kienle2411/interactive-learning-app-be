import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';

@Module({
  providers: [AssignmentsService],
  controllers: [AssignmentsController]
})
export class AssignmentsModule {}

import { Module } from '@nestjs/common';
import { StudentInGroupService } from './student-in-group.service';
import { StudentInGroupController } from './student-in-group.controller';

@Module({
  providers: [StudentInGroupService],
  controllers: [StudentInGroupController]
})
export class StudentInGroupModule {}

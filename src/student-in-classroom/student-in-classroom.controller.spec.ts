import { Test, TestingModule } from '@nestjs/testing';
import { StudentInClassroomController } from './student-in-classroom.controller';

describe('StudentInClassroomController', () => {
  let controller: StudentInClassroomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentInClassroomController],
    }).compile();

    controller = module.get<StudentInClassroomController>(StudentInClassroomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { StudentInGroupController } from './student-in-group.controller';

describe('StudentInGroupController', () => {
  let controller: StudentInGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentInGroupController],
    }).compile();

    controller = module.get<StudentInGroupController>(StudentInGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

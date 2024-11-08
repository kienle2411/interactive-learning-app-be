import { Test, TestingModule } from '@nestjs/testing';
import { StudentInClassroomService } from './student-in-classroom.service';

describe('StudentInClassroomService', () => {
  let service: StudentInClassroomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentInClassroomService],
    }).compile();

    service = module.get<StudentInClassroomService>(StudentInClassroomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

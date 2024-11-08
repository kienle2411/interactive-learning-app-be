import { Test, TestingModule } from '@nestjs/testing';
import { StudentInGroupService } from './student-in-group.service';

describe('StudentInGroupService', () => {
  let service: StudentInGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentInGroupService],
    }).compile();

    service = module.get<StudentInGroupService>(StudentInGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

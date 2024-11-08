import { Test, TestingModule } from '@nestjs/testing';
import { DocfilesService } from './docfiles.service';

describe('DocfilesService', () => {
  let service: DocfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocfilesService],
    }).compile();

    service = module.get<DocfilesService>(DocfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

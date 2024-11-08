import { Test, TestingModule } from '@nestjs/testing';
import { DocfilesController } from './docfiles.controller';

describe('DocfilesController', () => {
  let controller: DocfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocfilesController],
    }).compile();

    controller = module.get<DocfilesController>(DocfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

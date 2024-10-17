import { Test, TestingModule } from '@nestjs/testing';
import { ChoiceController } from './choice.controller';

describe('ChoiceController', () => {
  let controller: ChoiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChoiceController],
    }).compile();

    controller = module.get<ChoiceController>(ChoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

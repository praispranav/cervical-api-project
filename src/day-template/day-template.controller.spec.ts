import { Test, TestingModule } from '@nestjs/testing';
import { DayTemplateController } from './day-template.controller';

describe('DayTemplateController', () => {
  let controller: DayTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DayTemplateController],
    }).compile();

    controller = module.get<DayTemplateController>(DayTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

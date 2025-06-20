import { Test, TestingModule } from '@nestjs/testing';
import { DayTemplateService } from './day-template.service';

describe('DayTemplateService', () => {
  let service: DayTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DayTemplateService],
    }).compile();

    service = module.get<DayTemplateService>(DayTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

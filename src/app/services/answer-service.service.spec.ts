import { TestBed } from '@angular/core/testing';

import { AnswerServiceService } from './answer-service.service';

describe('AnswerServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnswerServiceService = TestBed.get(AnswerServiceService);
    expect(service).toBeTruthy();
  });
});

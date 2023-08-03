import { TestBed } from '@angular/core/testing';

import { OcrServiceService } from './ocr-service.service';

describe('OcrServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OcrServiceService = TestBed.get(OcrServiceService);
    expect(service).toBeTruthy();
  });
});

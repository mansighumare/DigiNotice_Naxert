import { TestBed } from '@angular/core/testing';

import { OrgReportService } from './org-report.service';

describe('OrgReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrgReportService = TestBed.get(OrgReportService);
    expect(service).toBeTruthy();
  });
});

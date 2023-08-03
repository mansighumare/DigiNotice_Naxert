import { TestBed } from '@angular/core/testing';

import { AdBannerService } from './ad-banner.service';

describe('AdBannerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdBannerService = TestBed.get(AdBannerService);
    expect(service).toBeTruthy();
  });
});

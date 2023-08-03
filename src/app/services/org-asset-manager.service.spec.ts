import { TestBed } from '@angular/core/testing';

import { OrgAssetManagerService } from './org-asset-manager.service';

describe('OrgAssetManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrgAssetManagerService = TestBed.get(OrgAssetManagerService);
    expect(service).toBeTruthy();
  });
});

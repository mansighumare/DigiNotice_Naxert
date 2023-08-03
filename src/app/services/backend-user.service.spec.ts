import { TestBed } from '@angular/core/testing';

import { BackendUserService } from './backend-user.service';

describe('BackendUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BackendUserService = TestBed.get(BackendUserService);
    expect(service).toBeTruthy();
  });
});

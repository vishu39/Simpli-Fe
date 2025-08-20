import { TestBed } from '@angular/core/testing';

import { SupremAuthGuardGuard } from './suprem-auth-guard.guard';

describe('SupremAuthGuardGuard', () => {
  let guard: SupremAuthGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SupremAuthGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { HospitalLinkGuard } from './hospital-link.guard';

describe('HospitalLinkGuard', () => {
  let guard: HospitalLinkGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HospitalLinkGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

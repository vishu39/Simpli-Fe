import { TestBed } from '@angular/core/testing';

import { GlobalCancelService } from './global-cancel.service';

describe('GlobalCancelService', () => {
  let service: GlobalCancelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalCancelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

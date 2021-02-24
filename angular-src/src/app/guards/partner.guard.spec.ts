import { TestBed } from '@angular/core/testing';

import { PartnerGuard } from './partner.guard';

describe('PartnerGuard', () => {
  let guard: PartnerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PartnerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

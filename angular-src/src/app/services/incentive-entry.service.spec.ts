import { TestBed } from '@angular/core/testing';

import { IncentiveEntryService } from './incentive-entry.service';

describe('IncentiveEntryService', () => {
  let service: IncentiveEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncentiveEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

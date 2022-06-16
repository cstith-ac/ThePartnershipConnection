import { TestBed } from '@angular/core/testing';

import { RmlistService } from './rmlist.service';

describe('RmlistService', () => {
  let service: RmlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RmlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

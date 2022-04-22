import { TestBed } from '@angular/core/testing';

import { NmcService } from './nmc.service';

describe('NmcService', () => {
  let service: NmcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NmcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { AppinsightsService } from './appinsights.service';

describe('AppinsightsService', () => {
  let service: AppinsightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppinsightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

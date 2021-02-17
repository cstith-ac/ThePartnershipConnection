import { TestBed } from '@angular/core/testing';

import { PreventloggedinaccessGuard } from './preventloggedinaccess.guard';

describe('PreventloggedinaccessGuard', () => {
  let guard: PreventloggedinaccessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PreventloggedinaccessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

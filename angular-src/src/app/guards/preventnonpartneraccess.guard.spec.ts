import { TestBed } from '@angular/core/testing';

import { PreventnonpartneraccessGuard } from './preventnonpartneraccess.guard';

describe('PreventnonpartneraccessGuard', () => {
  let guard: PreventnonpartneraccessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PreventnonpartneraccessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveentryComponent } from './incentiveentry.component';

describe('IncentiveentryComponent', () => {
  let component: IncentiveentryComponent;
  let fixture: ComponentFixture<IncentiveentryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentiveentryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

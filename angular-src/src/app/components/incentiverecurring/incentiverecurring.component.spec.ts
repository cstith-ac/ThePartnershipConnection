import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiverecurringComponent } from './incentiverecurring.component';

describe('IncentiverecurringComponent', () => {
  let component: IncentiverecurringComponent;
  let fixture: ComponentFixture<IncentiverecurringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentiverecurringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiverecurringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

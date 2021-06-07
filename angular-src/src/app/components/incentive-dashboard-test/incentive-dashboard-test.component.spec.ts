import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveDashboardTestComponent } from './incentive-dashboard-test.component';

describe('IncentiveDashboardTestComponent', () => {
  let component: IncentiveDashboardTestComponent;
  let fixture: ComponentFixture<IncentiveDashboardTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentiveDashboardTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveDashboardTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsummaryComponent } from './callsummary.component';

describe('CallsummaryComponent', () => {
  let component: CallsummaryComponent;
  let fixture: ComponentFixture<CallsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallsummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsummaryproblemsComponent } from './callsummaryproblems.component';

describe('CallsummaryproblemsComponent', () => {
  let component: CallsummaryproblemsComponent;
  let fixture: ComponentFixture<CallsummaryproblemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallsummaryproblemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsummaryproblemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

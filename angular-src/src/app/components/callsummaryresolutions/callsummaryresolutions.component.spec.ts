import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsummaryresolutionsComponent } from './callsummaryresolutions.component';

describe('CallsummaryresolutionsComponent', () => {
  let component: CallsummaryresolutionsComponent;
  let fixture: ComponentFixture<CallsummaryresolutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallsummaryresolutionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsummaryresolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

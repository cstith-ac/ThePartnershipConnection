import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsummaryaddComponent } from './callsummaryadd.component';

describe('CallsummaryaddComponent', () => {
  let component: CallsummaryaddComponent;
  let fixture: ComponentFixture<CallsummaryaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallsummaryaddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsummaryaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

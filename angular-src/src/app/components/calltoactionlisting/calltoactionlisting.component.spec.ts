import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalltoactionlistingComponent } from './calltoactionlisting.component';

describe('CalltoactionlistingComponent', () => {
  let component: CalltoactionlistingComponent;
  let fixture: ComponentFixture<CalltoactionlistingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalltoactionlistingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalltoactionlistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

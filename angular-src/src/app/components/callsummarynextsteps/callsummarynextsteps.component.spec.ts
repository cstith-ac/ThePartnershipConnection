import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsummarynextstepsComponent } from './callsummarynextsteps.component';

describe('CallsummarynextstepsComponent', () => {
  let component: CallsummarynextstepsComponent;
  let fixture: ComponentFixture<CallsummarynextstepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallsummarynextstepsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsummarynextstepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

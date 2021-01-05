import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsummaryclasslistComponent } from './callsummaryclasslist.component';

describe('CallsummaryclasslistComponent', () => {
  let component: CallsummaryclasslistComponent;
  let fixture: ComponentFixture<CallsummaryclasslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallsummaryclasslistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsummaryclasslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

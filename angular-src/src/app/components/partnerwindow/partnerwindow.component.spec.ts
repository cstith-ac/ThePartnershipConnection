import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerwindowComponent } from './partnerwindow.component';

describe('PartnerwindowComponent', () => {
  let component: PartnerwindowComponent;
  let fixture: ComponentFixture<PartnerwindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerwindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerwindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

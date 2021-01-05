import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnercontactlistComponent } from './partnercontactlist.component';

describe('PartnercontactlistComponent', () => {
  let component: PartnercontactlistComponent;
  let fixture: ComponentFixture<PartnercontactlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnercontactlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnercontactlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

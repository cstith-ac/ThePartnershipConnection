import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerservicelistingComponent } from './partnerservicelisting.component';

describe('PartnerservicelistingComponent', () => {
  let component: PartnerservicelistingComponent;
  let fixture: ComponentFixture<PartnerservicelistingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerservicelistingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerservicelistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

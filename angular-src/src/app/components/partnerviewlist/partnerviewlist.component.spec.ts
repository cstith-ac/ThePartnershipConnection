import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerviewlistComponent } from './partnerviewlist.component';

describe('PartnerviewlistComponent', () => {
  let component: PartnerviewlistComponent;
  let fixture: ComponentFixture<PartnerviewlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerviewlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerviewlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

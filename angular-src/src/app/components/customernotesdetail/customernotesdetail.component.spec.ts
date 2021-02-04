import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomernotesdetailComponent } from './customernotesdetail.component';

describe('CustomernotesdetailComponent', () => {
  let component: CustomernotesdetailComponent;
  let fixture: ComponentFixture<CustomernotesdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomernotesdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomernotesdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

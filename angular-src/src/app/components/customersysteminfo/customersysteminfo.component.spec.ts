import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersysteminfoComponent } from './customersysteminfo.component';

describe('CustomersysteminfoComponent', () => {
  let component: CustomersysteminfoComponent;
  let fixture: ComponentFixture<CustomersysteminfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomersysteminfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersysteminfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

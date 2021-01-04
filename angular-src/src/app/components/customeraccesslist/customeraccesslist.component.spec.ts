import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomeraccesslistComponent } from './customeraccesslist.component';

describe('CustomeraccesslistComponent', () => {
  let component: CustomeraccesslistComponent;
  let fixture: ComponentFixture<CustomeraccesslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomeraccesslistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomeraccesslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

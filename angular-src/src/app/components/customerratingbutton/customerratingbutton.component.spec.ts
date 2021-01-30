import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerratingbuttonComponent } from './customerratingbutton.component';

describe('CustomerratingbuttonComponent', () => {
  let component: CustomerratingbuttonComponent;
  let fixture: ComponentFixture<CustomerratingbuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerratingbuttonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerratingbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

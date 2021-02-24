import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Customer3glistingComponent } from './customer3glisting.component';

describe('Customer3glistingComponent', () => {
  let component: Customer3glistingComponent;
  let fixture: ComponentFixture<Customer3glistingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Customer3glistingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Customer3glistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

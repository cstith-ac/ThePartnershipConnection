import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentivenewcustomerComponent } from './incentivenewcustomer.component';

describe('IncentivenewcustomerComponent', () => {
  let component: IncentivenewcustomerComponent;
  let fixture: ComponentFixture<IncentivenewcustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentivenewcustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentivenewcustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

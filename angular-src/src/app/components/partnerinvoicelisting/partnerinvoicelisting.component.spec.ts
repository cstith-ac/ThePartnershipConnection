import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerinvoicelistingComponent } from './partnerinvoicelisting.component';

describe('PartnerinvoicelistingComponent', () => {
  let component: PartnerinvoicelistingComponent;
  let fixture: ComponentFixture<PartnerinvoicelistingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerinvoicelistingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerinvoicelistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

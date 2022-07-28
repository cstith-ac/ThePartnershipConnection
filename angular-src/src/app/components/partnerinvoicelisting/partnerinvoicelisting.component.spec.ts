import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PartnerinvoicelistingComponent } from './partnerinvoicelisting.component';

describe('PartnerinvoicelistingComponent', () => {
  let component: PartnerinvoicelistingComponent;
  let fixture: ComponentFixture<PartnerinvoicelistingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBuilder, ReactiveFormsModule],
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

  it('should create a form using formbuilder', () => {
    expect(component.partnerInvoiceListingForm instanceof FormGroup).toBeTruthy();
  })
});

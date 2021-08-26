import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpcpartneragingreportComponent } from './tpcpartneragingreport.component';

describe('TpcpartneragingreportComponent', () => {
  let component: TpcpartneragingreportComponent;
  let fixture: ComponentFixture<TpcpartneragingreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TpcpartneragingreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TpcpartneragingreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

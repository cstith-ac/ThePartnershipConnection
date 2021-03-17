import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveequipmatComponent } from './incentiveequipmat.component';

describe('IncentiveequipmatComponent', () => {
  let component: IncentiveequipmatComponent;
  let fixture: ComponentFixture<IncentiveequipmatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentiveequipmatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveequipmatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomertositelistComponent } from './customertositelist.component';

describe('CustomertositelistComponent', () => {
  let component: CustomertositelistComponent;
  let fixture: ComponentFixture<CustomertositelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomertositelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomertositelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

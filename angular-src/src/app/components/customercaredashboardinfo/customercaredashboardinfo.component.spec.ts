import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomercaredashboardinfoComponent } from './customercaredashboardinfo.component';

describe('CustomercaredashboardinfoComponent', () => {
  let component: CustomercaredashboardinfoComponent;
  let fixture: ComponentFixture<CustomercaredashboardinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomercaredashboardinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomercaredashboardinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

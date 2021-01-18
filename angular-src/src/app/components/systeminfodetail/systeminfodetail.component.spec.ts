import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysteminfodetailComponent } from './systeminfodetail.component';

describe('SysteminfodetailComponent', () => {
  let component: SysteminfodetailComponent;
  let fixture: ComponentFixture<SysteminfodetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysteminfodetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SysteminfodetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

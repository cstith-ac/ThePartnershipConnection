import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceviewComponent } from './serviceview.component';

describe('ServiceviewComponent', () => {
  let component: ServiceviewComponent;
  let fixture: ComponentFixture<ServiceviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

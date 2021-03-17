import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentivedashboardComponent } from './incentivedashboard.component';

describe('IncentivedashboardComponent', () => {
  let component: IncentivedashboardComponent;
  let fixture: ComponentFixture<IncentivedashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentivedashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentivedashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

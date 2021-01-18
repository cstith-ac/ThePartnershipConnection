import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentcustomersComponent } from './recentcustomers.component';

describe('RecentcustomersComponent', () => {
  let component: RecentcustomersComponent;
  let fixture: ComponentFixture<RecentcustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentcustomersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentcustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

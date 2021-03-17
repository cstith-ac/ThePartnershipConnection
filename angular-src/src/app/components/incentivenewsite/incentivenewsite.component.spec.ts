import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentivenewsiteComponent } from './incentivenewsite.component';

describe('IncentivenewsiteComponent', () => {
  let component: IncentivenewsiteComponent;
  let fixture: ComponentFixture<IncentivenewsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentivenewsiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentivenewsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

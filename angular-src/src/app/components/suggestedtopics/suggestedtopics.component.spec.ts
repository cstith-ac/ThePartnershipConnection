import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedtopicsComponent } from './suggestedtopics.component';

describe('SuggestedtopicsComponent', () => {
  let component: SuggestedtopicsComponent;
  let fixture: ComponentFixture<SuggestedtopicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestedtopicsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedtopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

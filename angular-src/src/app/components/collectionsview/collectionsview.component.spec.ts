import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsviewComponent } from './collectionsview.component';

describe('CollectionsviewComponent', () => {
  let component: CollectionsviewComponent;
  let fixture: ComponentFixture<CollectionsviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionsviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionsviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

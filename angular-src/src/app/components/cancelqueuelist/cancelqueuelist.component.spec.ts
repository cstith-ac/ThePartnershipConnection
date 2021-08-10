import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelquelistComponent } from './cancelqueuelist.component';

describe('CancelqueuelistComponent', () => {
  let component: CancelqueuelistComponent;
  let fixture: ComponentFixture<CancelqueuelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelqueuelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelqueuelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

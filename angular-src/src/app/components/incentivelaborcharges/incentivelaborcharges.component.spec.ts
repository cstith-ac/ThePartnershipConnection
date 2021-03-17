import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentivelaborchargesComponent } from './incentivelaborcharges.component';

describe('IncentivelaborchargesComponent', () => {
  let component: IncentivelaborchargesComponent;
  let fixture: ComponentFixture<IncentivelaborchargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentivelaborchargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentivelaborchargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

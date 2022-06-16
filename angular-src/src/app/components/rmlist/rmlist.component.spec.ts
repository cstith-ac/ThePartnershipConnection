import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmlistComponent } from './rmlist.component';

describe('RmlistComponent', () => {
  let component: RmlistComponent;
  let fixture: ComponentFixture<RmlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

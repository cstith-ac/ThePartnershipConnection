import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmlisteditComponent } from './rmlistedit.component';

describe('RmlisteditComponent', () => {
  let component: RmlisteditComponent;
  let fixture: ComponentFixture<RmlisteditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmlisteditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmlisteditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

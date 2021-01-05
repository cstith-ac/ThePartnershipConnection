import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerinformationComponent } from './partnerinformation.component';

describe('PartnerinformationComponent', () => {
  let component: PartnerinformationComponent;
  let fixture: ComponentFixture<PartnerinformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerinformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerinformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

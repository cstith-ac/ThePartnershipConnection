import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticalmessageComponent } from './criticalmessage.component';

describe('CriticalmessageComponent', () => {
  let component: CriticalmessageComponent;
  let fixture: ComponentFixture<CriticalmessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriticalmessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CriticalmessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

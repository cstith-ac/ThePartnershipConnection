import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcassistantSystemsComponent } from './ccassistant-systems.component';

describe('CcassistantSystemsComponent', () => {
  let component: CcassistantSystemsComponent;
  let fixture: ComponentFixture<CcassistantSystemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcassistantSystemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcassistantSystemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

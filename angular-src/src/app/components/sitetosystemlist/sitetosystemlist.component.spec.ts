import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitetosystemlistComponent } from './sitetosystemlist.component';

describe('SitetosystemlistComponent', () => {
  let component: SitetosystemlistComponent;
  let fixture: ComponentFixture<SitetosystemlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SitetosystemlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SitetosystemlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

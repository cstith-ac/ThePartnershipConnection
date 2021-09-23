import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerconnsplashpageComponent } from './partnerconnsplashpage.component';

describe('PartnerconnsplashpageComponent', () => {
  let component: PartnerconnsplashpageComponent;
  let fixture: ComponentFixture<PartnerconnsplashpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerconnsplashpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerconnsplashpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecureLandingPageComponent } from './secure-landing-page.component';

describe('SecureLandingPageComponent', () => {
  let component: SecureLandingPageComponent;
  let fixture: ComponentFixture<SecureLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecureLandingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecureLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

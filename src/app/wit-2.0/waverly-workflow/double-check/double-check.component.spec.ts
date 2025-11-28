import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleCheckComponent } from './double-check.component';

describe('DoubleCheckComponent', () => {
  let component: DoubleCheckComponent;
  let fixture: ComponentFixture<DoubleCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoubleCheckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoubleCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

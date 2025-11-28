import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinetProductListComponent } from './cabinet-product-list.component';

describe('CabinetProductListComponent', () => {
  let component: CabinetProductListComponent;
  let fixture: ComponentFixture<CabinetProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinetProductListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinetProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

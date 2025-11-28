import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportProductFromWooCommerceCsvComponent } from './import-product-from-wooCommerce-csv.component';

describe('CsvImportComponent', () => {
  let component: ImportProductFromWooCommerceCsvComponent;
  let fixture: ComponentFixture<ImportProductFromWooCommerceCsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportProductFromWooCommerceCsvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportProductFromWooCommerceCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

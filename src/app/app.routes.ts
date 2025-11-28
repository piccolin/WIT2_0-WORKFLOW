import { Routes } from '@angular/router';

export const routes: Routes = [
  //-- Product Paths ---//
  {
    path: 'product',
    loadComponent: () => import('@wit/product/cabinet-product/cabinet-product.component')
      .then(m => m.CabinetProductComponent),
    title: 'Dashboard',
  },
  {
    path: 'import',
    loadComponent: () => import('@wit/product/csv-import/csv-import.component')
      .then(m => m.CsvImportComponent),
    title: 'Dashboard',
  },
  {
    path: 'list',
    loadComponent: () => import('@wit/product/product-list/cabinet-product-list/cabinet-product-list.component')
      .then(m => m.CabinetProductListComponent),
    title: 'Dashboard',
  },
  //-- Double Check Paths ---//
];

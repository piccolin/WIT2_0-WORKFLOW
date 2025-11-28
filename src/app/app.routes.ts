import { Routes } from '@angular/router';
import {SignupComponent} from "@app/app-auth/signup/signup.component";
import {authGuard} from "@app/app-auth/auth.guard";

export const routes: Routes = [
  //-- Product Paths ---//
  {
    path: 'login',
    component: SignupComponent,
  },
  {
    path: 'product',
    loadComponent: () => import('@wit/product/cabinet-product/cabinet-product.component')
      .then(m => m.CabinetProductComponent),
    title: 'Dashboard',
    canActivate: [authGuard],
  },
  {
    path: 'import',
    loadComponent: () => import('@wit/product/csv-import/csv-import.component')
      .then(m => m.CsvImportComponent),
    title: 'Dashboard',
    canActivate: [authGuard]
  },
  {
    path: 'list',
    loadComponent: () => import('@wit/product/product-list/cabinet-product-list/cabinet-product-list.component')
      .then(m => m.CabinetProductListComponent),
    title: 'Dashboard',
    canActivate: [authGuard]
  },
  //-- Double Check Paths ---//

  { path: '', redirectTo: '/product', pathMatch: 'full' },
  { path: '**', redirectTo: '/product' },
];

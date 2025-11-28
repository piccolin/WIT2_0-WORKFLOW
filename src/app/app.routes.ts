import { Routes } from '@angular/router';
import {authGuard} from "@app/app-auth/auth.guard";

export const routes: Routes = [
  //-- Authentication  ---//
  {
    path: 'signin',
    loadComponent: () => import('@wit/e-commerce/signin/signin.component')
      .then(component => component.SigninComponent),
    title: 'Sign In',
    //canActivate: [unAuthGuard]
  },

  {
    path: 'home',
    loadComponent: () => import('@wit/test/secure-landing-page/secure-landing-page.component')
      .then(component => component.SecureLandingPageComponent),
    title: 'Secure Homepage',
    canActivate: [authGuard]
  },


  //-- Product Paths ---//
  {
    path: 'product/add',
    loadComponent: () => import('@wit/e-commerce/product/add-product/add-product.component')
      .then(component => component.AddProductComponent),
    title: 'Add Products',
  },
  {
    path: 'product/import/woocommerce',
    loadComponent: () => import('@wit/shared/import-product/woo-commerce/import-product-from-wooCommerce-csv.component')
      .then(component => component.ImportProductFromWooCommerceCsvComponent),
    title: 'Dashboard',
  },
  {
    path: 'product/list',
    loadComponent: () => import('@wit/e-commerce/product/list-product/list-product.component')
      .then(component => component.ListProductComponent),
    title: 'List Products',
  },

  //-- Double Check Paths ---//
  {
    path: 'workflow/double-check',
    loadComponent: () => import('@wit/e-commerce/product/list-product/list-product.component')
      .then(component => component.ListProductComponent),
    title: 'List Products',
  },

  //-- Default Paths ---//
  { path: '', redirectTo: '/workflow/double-check', pathMatch: 'full' },
  { path: '**', redirectTo: '/workflow/double-check' },
];

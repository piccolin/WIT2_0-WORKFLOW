import { Routes } from '@angular/router';

export const routes: Routes = [

  //-- Double Check Paths ---//
  {
    path: 'workflow/double-check',
    loadComponent: () => import('@wit/waverly-workflow/double-check/double-check.component')
      .then(component => component.DoubleCheckComponent),
    title: 'Double Check',
  },

  //-- Default Paths ---//
  { path: '', redirectTo: '/workflow/double-check', pathMatch: 'full' },
  { path: '**', redirectTo: '/workflow/double-check' },
];

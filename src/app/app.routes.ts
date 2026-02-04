import { Routes } from '@angular/router';
import {ComparatorTestComponent} from "@wit/waverly-workflow/Comparator/Test/comparator-test.component";
import {ComparatorTest3Component} from "@wit/waverly-workflow/Comparator/Test/comparator-test-3.component";

export const routes: Routes = [

  //-- Double Check Paths ---//
  {
    path: 'workflow/double-check',
    loadComponent: () => import('@wit/waverly-workflow/double-check/double-check.component')
      .then(component => component.DoubleCheckComponent),
    title: 'Double Check',
  },

  {
    path: 'comparator-test',
    component: ComparatorTestComponent,
  },
  {
    path: 'comparator-test-3',
    component: ComparatorTest3Component,
  },

  //-- Default Paths ---//
  { path: '', redirectTo: '/workflow/double-check', pathMatch: 'full' },
  { path: '**', redirectTo: '/workflow/double-check' },
];

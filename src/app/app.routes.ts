import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'totem',
    loadComponent: () => import('./totem/totem.page').then(m => m.TotemPage)
  },
  {
    path: 'caja',
    loadComponent: () => import('./caja/caja.page').then(m => m.CajaPage)
  },
  {
    path: 'reportes',
    loadComponent: () => import('./reportes/reportes.page').then(m => m.ReportesPage)
  },
];
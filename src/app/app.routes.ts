import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'board',
    loadComponent: () => import('./pages/board/board').then((m) => m.BoardComponent),
  },
  {
    path: 'task/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/task-detail/task-detail').then((m) => m.TaskDetail),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

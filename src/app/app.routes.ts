import { Routes } from '@angular/router';

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
    loadComponent: () => import('./pages/task-detail/task-detail').then((m) => m.TaskDetail),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

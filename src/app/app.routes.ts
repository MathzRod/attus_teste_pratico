import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/users/pages/users-list/users-list.component').then(
        (m) => m.UsersListComponent
      ),
  },
];

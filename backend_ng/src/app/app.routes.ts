import { Routes } from '@angular/router';
import { Entry } from './entry/entry';

export const routes: Routes = [
  { path: 'register', component: Entry },
  { path: '', redirectTo: 'register', pathMatch: 'full' },
];

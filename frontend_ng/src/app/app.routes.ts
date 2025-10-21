import { Routes } from '@angular/router';
import { Entry } from './entry/entry';
import { Home } from './home/home';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'register', component: Entry },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

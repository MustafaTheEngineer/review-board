import { Routes } from '@angular/router';
import { Entry } from './entry/entry';
import { Home } from './home/home';
import { ConfirmAccount } from './confirm-account/confirm-account';

export const routes: Routes = [
  { path: 'entry', component: Entry },
  { path: 'confirm-account', component: ConfirmAccount },
  { path: 'home', component: Home },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

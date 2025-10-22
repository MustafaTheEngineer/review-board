import { Routes } from '@angular/router';
import { Entry } from './entry/entry';
import { Home } from './home/home';
import { ConfirmAccount } from './confirm-account/confirm-account';
import { ChooseUsername } from './choose-username/choose-username';
import { ManageItem } from './manage-item/manage-item';

export const routes: Routes = [
  { path: 'entry', component: Entry },
  { path: 'confirm-account', component: ConfirmAccount },
  { path: 'choose-username', component: ChooseUsername },
  {
    path: 'home',
    component: Home,
    children: [
      {
        path: 'item',
        children: [
          {
            path: 'manage',
            children: [
              {
                path: '',
                component: ManageItem,
              },
            ],
          },
          {
            path: '',
            redirectTo: 'manage',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: '',
        redirectTo: 'item',
        pathMatch: 'full',
      },
    ],
  },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

import { Routes } from '@angular/router';
import { Entry } from './entry/entry';
import { Home } from './home/home';
import { ConfirmAccount } from './confirm-account/confirm-account';
import { ChooseUsername } from './choose-username/choose-username';
import { ManageItem } from './manage-item/manage-item';
import { SearchItem } from './search-item/search-item';
import { ItemDetails } from './item-details/item-details';
import { Logs } from './logs/logs';

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
            path: 'search',
            component: SearchItem,
          },
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
            path: ':id',
            component: ItemDetails,
          },
          {
            path: '',
            redirectTo: 'search',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'logs',
        component: Logs,
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

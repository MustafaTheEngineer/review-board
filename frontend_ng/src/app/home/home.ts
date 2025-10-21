import { KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  TuiAppearance,
  TuiButton,
  TuiDataList,
  TuiDropdown,
  TuiDropdownService,
  TuiIcon,
  TuiLink,
  TuiTextfield,
  TuiTitle,
} from '@taiga-ui/core';
import {
  TuiAvatar,
  TuiBadge,
  TuiBadgeNotification,
  TuiBreadcrumbs,
  TuiChevron,
  TuiDataListDropdownManager,
  TuiFade,
  TuiSwitch,
  TuiTabs,
} from '@taiga-ui/kit';
import { TuiCardLarge, TuiForm, TuiHeader, TuiNavigation } from '@taiga-ui/layout';
import { tuiAsPortal, TuiPortals, TuiRepeatTimes } from '@taiga-ui/cdk';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    KeyValuePipe,
    NgForOf,
    NgIf,
    RouterLink,
    RouterLinkActive,
    TuiAppearance,
    TuiAvatar,
    TuiBadge,
    TuiBadgeNotification,
    TuiBreadcrumbs,
    TuiButton,
    TuiCardLarge,
    TuiChevron,
    TuiDataList,
    TuiDataListDropdownManager,
    TuiDropdown,
    TuiFade,
    TuiForm,
    TuiHeader,
    TuiIcon,
    TuiLink,
    TuiNavigation,
    TuiRepeatTimes,
    TuiSwitch,
    TuiTabs,
    TuiTextfield,
    TuiTitle,
  ],
  templateUrl: './home.html',
  styleUrl: './home.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDropdownService, tuiAsPortal(TuiDropdownService)],
})
export class Home {
  protected expanded = signal(false);
  protected open = false;
  protected switch = false;
  protected readonly routes: any = {};
  protected readonly breadcrumbs = ['Home', 'Angular', 'Repositories', 'Taiga UI'];

  protected readonly drawer = {
    Components: [
      { name: 'Button', icon: 'ICON' },
      { name: 'Input', icon: 'ICON' },
      { name: 'Tooltip', icon: 'ICON' },
    ],
    Essentials: [
      { name: 'Getting started', icon: 'ICON' },
      { name: 'Showcase', icon: 'ICON' },
      { name: 'Typography', icon: 'ICON' },
    ],
  };

  protected handleToggle(): void {
    this.expanded.update((e) => !e);
  }
}

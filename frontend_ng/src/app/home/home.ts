import { KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    TuiAppearance,
    TuiAvatar,
    TuiBadge,
    TuiBadgeNotification,
    TuiBreadcrumbs,
    TuiButton,
    TuiChevron,
    TuiDataList,
    TuiDataListDropdownManager,
    TuiDropdown,
    TuiFade,
    TuiIcon,
    TuiLink,
    TuiNavigation,
    TuiTabs,
    TuiTextfield,
  ],
  templateUrl: './home.html',
  styleUrl: './home.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  router = inject(Router);

  protected expanded = signal(false);
  protected readonly routes: any = {};
  protected readonly breadcrumbs = ['Home'];

  protected handleToggle(): void {
    this.expanded.update((e) => !e);
  }

  routeTo(path: string[]): void {
    this.router.navigate(path);
  }
}

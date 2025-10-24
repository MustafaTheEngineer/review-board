import { KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
import { AppService } from '../app-service';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

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
  appService = inject(AppService);

  breadcrumbs = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) =>
        event.urlAfterRedirects
          .split('/')
          .slice(1)
          .map((route) => route.toUpperCase()),
      ),
    ),{
      initialValue: ['HOME']
    }
  );

  protected expanded = signal(false);

  protected handleToggle(): void {
    this.expanded.update((e) => !e);
  }

  routeTo(path: string[]): void {
    this.router.navigate(path);
  }
}

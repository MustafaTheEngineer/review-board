import { TuiBreakpointService, TuiButton, TuiRoot } from '@taiga-ui/core';
import {
  afterEveryRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { gql } from 'apollo-angular';
import { ValidateTokenGQL } from '../graphql/generated';
import { catchError, map, of } from 'rxjs';
import { AppService } from './app-service';
import { ErrorService } from './error-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { TuiNgControl } from "@taiga-ui/cdk";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot],
  templateUrl: './app.html',
  styleUrl: './app.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  appService = inject(AppService);
  errorService = inject(ErrorService);

  protected readonly title = signal('frontend_ng');
}

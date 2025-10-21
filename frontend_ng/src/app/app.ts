import { TuiRoot } from '@taiga-ui/core';
import { afterEveryRender, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { gql } from 'apollo-angular';
import { ValidateTokenGQL } from '../graphql/generated';
import { catchError, of } from 'rxjs';
import { AppService } from './app-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {
  appService = inject(AppService);

  protected readonly title = signal('frontend_ng');
}



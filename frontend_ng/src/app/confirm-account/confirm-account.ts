import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiPlatform } from '@taiga-ui/cdk';
import { TuiAppearance, TuiButton, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiBadge, TuiInputPin } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { gql } from 'apollo-angular';
import { ConfirmUserGQL } from '../../graphql/generated';
import { ErrorService } from '../error-service';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-account',
  imports: [
    ReactiveFormsModule,
    TuiInputPin,
    TuiTextfield,
    TuiAppearance,
    TuiBadge,
    TuiButton,
    TuiCardLarge,
    TuiHeader,
    TuiPlatform,
    TuiTitle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirm-account.html',
  styleUrl: './confirm-account.less',
  host: {
    style: `
      display: flex;
      justify-content: center;
      height: 100vh;

    `,
  },
})
export class ConfirmAccount {
  errorService = inject(ErrorService);
  router = inject(Router);
  confirmUserGQL = inject(ConfirmUserGQL);
  protected value = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(6), Validators.minLength(6)],
  });

  onSubmit() {
    this.confirmUserGQL
      .mutate({ variables: { input: { confirmationCode: this.value.value } } })
      .pipe(
        catchError((error) => {
          this.errorService.alerts
            .open(`<strong>${error.message}</strong>`, {
              appearance: 'negative',
              autoClose: 5000,
            })
            .subscribe();
          return of(new Error('Failed to confirm user'));
        }),
      )
      .subscribe((response) => {
        if (!(response instanceof Error)) {
          this.router.navigate(['choose-username']);
        }
      });
  }
}

const CONFIRM_USER = gql`
  mutation ConfirmUser($input: ConfirmUserInput!) {
    confirmUser(input: $input) {
      message
      user {
        email
        username
        role
        confirmed
      }
    }
  }
`;

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiError, TuiGroup, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiTooltip } from '@taiga-ui/kit';
import { gql } from 'apollo-angular';
import { catchError, map, of, switchMap } from 'rxjs';
import { IsUsernameTakenGQL } from '../../graphql/generated';

@Component({
  selector: 'app-choose-username',
  imports: [ReactiveFormsModule, TuiIcon, TuiTextfield, TuiTooltip, TuiGroup, TuiButton, TuiError],
  templateUrl: './choose-username.html',
  styleUrl: './choose-username.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: `
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    `,
  },
})
export class ChooseUsername {
  isUsernameTakenGQL = inject(IsUsernameTakenGQL);

  username = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9._-]*$'),
    ],
  });

  usernameError = toSignal(
    this.username.valueChanges.pipe(
      switchMap((username) => {
        if (!this.username.dirty && !this.username.touched) {
          return of(null);
        }

        if (username.length == 0) {
          return of('Enter a username');
        }

        if (username.length < 3) {
          return of('Username should be at least 3 characters long');
        }

        if (username.length > 20) {
          return of('Username should not exceed 20 characters');
        }
        if (this.username.hasError('pattern')) {
          return of(
            'Username should only contain alphanumeric characters, dots, underscores, or hyphens',
          );
        }

        return this.isUsernameTakenGQL
          .fetch({
            fetchPolicy: 'network-only',
            variables: { input: username },
          })
          .pipe(
            catchError((error) => {
              return of(new Error('Failed to check username availability'));
            }),
            map((data) => {
              console.log(data)
              if (data instanceof Error) {
                return 'Failed to check username availability';
              } else {
                return data.data?.isUsernameTaken ? 'Username is already taken' : null;
              }
            }),
          );
      }),
    ),
    {
      initialValue: null,
    },
  );
}

const IS_USERNAME_TAKEN = gql`
  query IsUsernameTaken($input: String!) {
    isUsernameTaken(username: $input)
  }
`;

const SET_USERNAME = gql`
  mutation SetUsername($input: String!) {
    setUsername(username: $input) {
      message
      user {
        email
        username
        confirmed
        blocked
      }
    }
  }
`;

import { Component, computed, inject, signal } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { RegisterUserGQL, Role, SignInGQL, ValidateTokenGQL } from '../../graphql/generated';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, combineLatest, filter, map, of, startWith, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  TuiAppearance,
  TuiButton,
  TuiError,
  TuiTextfield,
  TuiTitle,
  TuiLink,
} from '@taiga-ui/core';
import { TuiFieldErrorPipe, TuiSegmented, TuiSwitch, TuiTooltip } from '@taiga-ui/kit';
import { TuiCardLarge, TuiForm, TuiHeader } from '@taiga-ui/layout';
import { error } from 'console';
import { Router } from '@angular/router';
import { ErrorLink } from '@apollo/client/link/error';
import { ErrorService } from '../error-service';
import { AppService } from '../app-service';

@Component({
  selector: 'app-entry',
  imports: [
    ReactiveFormsModule,
    TuiAppearance,
    TuiButton,
    TuiCardLarge,
    TuiError,
    TuiForm,
    TuiHeader,
    TuiSegmented,
    TuiTextfield,
    TuiTitle,
    TuiLink,
  ],
  templateUrl: './entry.html',
  styleUrl: './entry.less',
  host: {
    style: `
      display: flex;
      justify-content: center;
      height: 100vh;

    `,
  },
})
export class Entry {
  errorService = inject(ErrorService);
  router = inject(Router);
  registerUserGQL = inject(RegisterUserGQL);
  signInGQL = inject(SignInGQL);
  validateTokenGQL = inject(ValidateTokenGQL);
  apollo = inject(Apollo);
  appService = inject(AppService);

  registerOrSignIn = signal(true);

  changeSegment() {
    this.registerOrSignIn.update((curr) => !curr);
  }

  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  emailError = toSignal(
    this.form.controls.email.valueChanges.pipe(
      map((email) => {
        if (!this.form.controls.email.dirty && !this.form.controls.email.touched) {
          return null;
        }
        if (email.length === 0) {
          return 'Email is required';
        }

        if (this.form.controls.email.hasError('email')) {
          return 'Invalid email format';
        }

        return null;
      }),
    ),
    {
      initialValue: null,
    },
  );
  passwordErr = toSignal(
    this.form.controls.password.valueChanges.pipe(
      map((email) => {
        if (!this.form.controls.password.dirty && !this.form.controls.password.touched) {
          return null;
        }
        if (email.length === 0) {
          return 'Password is required';
        }
        if (this.form.controls.password.hasError('minlength')) {
          return 'Password must be at least 8 characters long';
        }
        return null;
      }),
    ),
    {
      initialValue: null,
    },
  );

  passwordConfirmed = toSignal(
    combineLatest(
      [this.form.controls.password.valueChanges, this.form.controls.confirmPassword.valueChanges],
      (password, confirmPassword) => password === confirmPassword,
    ),
    {
      initialValue: true,
    },
  );
  passwordMatchErr = computed(() => {
    const passwordConfirmed = this.passwordConfirmed();
    if (!this.form.controls.confirmPassword.dirty && !this.form.controls.confirmPassword.touched) {
      return null;
    }

    return passwordConfirmed ? null : 'Passwords do not match';
  });

  onSubmit() {
    if (this.registerOrSignIn()) {
      this.registerUserGQL
        .mutate({
          variables: {
            input: {
              email: this.form.controls.email.value,
              password: this.form.controls.password.value,
            },
          },
        })
        .pipe(
          catchError((error) => {
            this.errorService.alerts
              .open(`<strong>${error.message}</strong>`, {
                appearance: 'negative',
                autoClose: 5000,
              })
              .subscribe();
            return of(new Error('Failed to register user'));
          }),
        )
        .subscribe((data) => {
          if (!(data instanceof Error)) {
            this.router.navigate(['confirm-account']);
          }
        });
    } else {
      this.signInGQL
        .mutate({
          fetchPolicy: 'network-only',
          variables: {
            input: {
              email: this.form.controls.email.value,
              password: this.form.controls.password.value,
            },
          },
        })
        .pipe(
          catchError((error) => {
            this.errorService.alerts
              .open(`<strong>${error.message}</strong>`, {
                appearance: 'negative',
                autoClose: 5000,
              })
              .subscribe();
            return of(new Error('Failed to sign in'));
          }),
          switchMap((result) => {
            if (result instanceof Error) {
              this.errorService.alerts
                .open(`<strong>${result.message}</strong>`, {
                  appearance: 'negative',
                  autoClose: 5000,
                })
                .subscribe();

              return of(new Error('Failed to sign in'));
            }

            return this.validateTokenGQL
              .fetch({
                fetchPolicy: 'network-only',
              })
              .pipe(
                catchError((error) => {
                  return of(new Error('Failed to validate token'));
                }),
                switchMap((result) => {
                  if (result instanceof Error) {
                    this.appService.user = {
                      id: '',
                      blocked: false,
                      confirmed: false,
                      email: '',
                      role: Role.User,
                    };

                    return of(null);
                  } else {
                    if (result.data?.validateToken)
                      this.appService.user = result.data?.validateToken.user;

                    this.router.navigate(['home']);

                    return of(null);
                  }
                }),
              );
          }),
        )
        .subscribe((data) => {
          if (!(data instanceof Error)) {
            this.router.navigate(['home']);
          }
        });
    }
  }
}

const REGISTER_USER = gql`
  mutation RegisterUser($input: NewUser!) {
    registerUser(input: $input) {
      message
      user {
        email
        username
        confirmed
        blocked
        role
      }
    }
  }
`;

const SIGNIN_USER = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      message
      user {
        email
        username
        confirmed
        blocked
        role
      }
    }
  }
`;

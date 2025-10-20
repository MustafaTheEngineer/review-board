import { Component, computed, inject, signal } from '@angular/core';
import { gql } from 'apollo-angular';
import { RegisterUserGQL, SignInGQL } from '../../graphql/generated';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { combineLatest, map, startWith } from 'rxjs';
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
  registerUserGQL = inject(RegisterUserGQL);
  signInGQL = inject(SignInGQL);

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
        .subscribe((data) => {
          console.log(data.data?.registerUser);
        });
    } else {
      this.signInGQL
        .mutate({
          variables: {
            input: {
              email: this.form.controls.email.value,
              password: this.form.controls.password.value,
            },
          },
        })
        .subscribe((data) => {
          console.log(data.data?.signIn);
        });
    }
  }
}

const REGISTER_USER = gql`
  mutation RegisterUser($input: NewUser!) {
    registerUser(input: $input) {
      metadata {
        code
        status
        message
        data
      }
      user {
        email
        username
        confirmed
        blocked
        role
      }
      token
    }
  }
`;

const SIGNIN_USER = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      metadata {
        code
        status
        message
        data
      }
      user {
        email
        username
        confirmed
        blocked
        role
      }
      token
    }
  }
`;

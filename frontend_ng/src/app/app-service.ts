import { afterNextRender, inject, Injectable, signal } from '@angular/core';
import { gql } from 'apollo-angular';
import {
  User,
  UserConfirmedGQL,
  UserHaveUsernameGQL,
  ValidateTokenGQL,
} from '../graphql/generated';
import { catchError, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private router = inject(Router);
  private validateTokenGQL = inject(ValidateTokenGQL);
  private userConfirmedGQL = inject(UserConfirmedGQL);
  private userHaveUsernameGQL = inject(UserHaveUsernameGQL);

  user: User = {
    id: '',
    blocked: false,
    confirmed: false,
    email: '',
    role: '',
  };

  constructor() {
    afterNextRender(() => {
      this.validateTokenGQL
        .fetch({
          fetchPolicy: 'network-only',
        })
        .pipe(
          catchError((error) => {
            return of(new Error('Failed to validate token'));
          }),
          switchMap((result) => {
            if (result instanceof Error) {
              this.user = {
                id: '',
                blocked: false,
                confirmed: false,
                email: '',
                role: '',
              };

              return of(null);
            } else {
              if (result.data?.validateToken) this.user = result.data?.validateToken.user;

              return this.userConfirmedGQL
                .fetch({
                  fetchPolicy: 'network-only',
                })
                .pipe(
                  switchMap((data) => {
                    if (data.error || !data.data?.userConfirmed) {
                      this.router.navigate(['confirm-account']);
                      return of(null);
                    }
                    return this.userHaveUsernameGQL.fetch({
                      fetchPolicy: 'network-only'
                    }).pipe(
                      switchMap(data => {
                        if (data.error || !data.data?.userHaveUsername) {
                          this.router.navigate(['choose-username']);
                          return of(null);
                        }
                        this.router.navigate(['home']);
                        return of(true);
                      })
                    )
                  }),
                );
            }
          }),
        )
        .subscribe();
    });
  }
}

const VALIDATE_TOKEN = gql`
  query ValidateToken {
    validateToken {
      user {
        id
        email
        username
        confirmed
        blocked
        role
      }
    }
  }
`;

const USER_CONFIRMED = gql`
  query UserConfirmed {
    userConfirmed
  }
`;

const HAVE_USERNAME = gql`
  query UserHaveUsername {
    userHaveUsername
  }
`;

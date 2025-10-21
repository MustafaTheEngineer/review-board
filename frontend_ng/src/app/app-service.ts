import { afterNextRender, inject, Injectable } from '@angular/core';
import { gql } from 'apollo-angular';
import { User, ValidateTokenGQL } from '../graphql/generated';
import { BehaviorSubject, catchError, of, shareReplay, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  user: User = {
    blocked: false,
    confirmed: false,
    email: '',
    role: '',
  };
  private validateTokenGQL = inject(ValidateTokenGQL);

  constructor() {
    afterNextRender(() => {
      this.validateTokenGQL
        .fetch({
          fetchPolicy: 'network-only',
        })
        .pipe(
          catchError((error) => {
            console.error('Error validating token:', error);
            return of(new Error('Failed to validate token'));
          }),
        )
        .subscribe((result) => {
          console.log(result);
          if (result instanceof Error) {
          } else {
            if (result.data?.validateToken) {
              this.user = result.data.validateToken.user;
            }
          }
        });
    });
  }
}

const VALIDATE_TOKEN = gql`
  query ValidateToken {
    validateToken {
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

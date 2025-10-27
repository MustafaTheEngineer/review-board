import { provideEventPlugins } from '@taiga-ui/event-plugins';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  inject,
} from '@angular/core';
import { provideRouter, Router } from '@angular/router';

import { routes } from './app.routes';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { AppService } from './app-service';
import { ErrorService } from './error-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideApollo(() => {
      const errorService = inject(ErrorService);
      const router = inject(Router);
      const httpLink = inject(HttpLink);
      const http = httpLink.create({ uri: 'http://31.97.35.242:8080/query', withCredentials: true });

      const error = new ErrorLink((options) => {
        if (options.result?.errors) {
          console.log(options.result.errors);
          for (const error of options.result.errors) {
            console.log(error.message);
            if (error.path) {
              if (error.path[0] === 'validateToken') {
                router.navigate(['entry']);
                return;
              }
            }
            if (error.message === 'User is not confirmed') {
              router.navigate(['confirm-account']);
              errorService.alerts
                .open('<strong>Please confirm your account first.</strong>', {
                  appearance: 'negative',
                  autoClose: 5000,
                })
                .subscribe();
              return;
            }
          }
        }
      });
      const link = error.concat(http);

      return {
        link,
        cache: new InMemoryCache(),
      };
    }),
    provideEventPlugins(),
  ],
};

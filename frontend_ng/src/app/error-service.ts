import { inject, Injectable, signal } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  readonly alerts = inject(TuiAlertService);
  actionBarOpen = signal(true);

  error = signal<{
    httpStatus: number;
    message: string;
  }>({
    httpStatus: 200,
    message: '',
  });
}

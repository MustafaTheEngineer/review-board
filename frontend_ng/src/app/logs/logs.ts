import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import { afterEveryRender, afterNextRender, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TuiScrollable, TuiScrollbar } from '@taiga-ui/core';
import { gql } from 'apollo-angular';
import { type TuiComparator, TuiTable } from '@taiga-ui/addon-table';
import { AuditLog, AuditLogsGQL, AuditLogsQuery } from '../../graphql/generated';
import { catchError, map, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ErrorService } from '../error-service';
import { DatePipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-logs',
  imports: [
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CdkVirtualScrollViewport,
    TuiScrollable,
    TuiScrollbar,
    TuiTable,
    DatePipe,
  ],
  templateUrl: './logs.html',
  styleUrl: './logs.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logs {
  auditLogsGQL = inject(AuditLogsGQL);
  errorService = inject(ErrorService);

  constructor() {
    afterNextRender(() => {
      this.auditLogsGQL
        .fetch({
          fetchPolicy: 'network-only',
        })
        .pipe(
          catchError((error) => {
            this.errorService.alerts
              .open(`<strong>${error.message}</strong>`, {
                appearance: 'negative',
                autoClose: 5000,
              })
              .subscribe();
            return of(new Error('Failed to fetch audit logs'));
          }),
          map((data) => {
            if (data instanceof Error) {
              return [];
            }
            if (!data.data?.auditLogs) {
              return [];
            }
            return data.data.auditLogs;
          }),
        )
        .subscribe((data) => {
          this.auditLogs.set(data)
        });
    });
  }
  auditLogs = signal<Array<AuditLog>>([]);

  protected readonly columns = [
    'id',
    'userId',
    'userEmail',
    'userRole',
    'entityType',
    'entityId',
    'action',
    'oldValues',
    'newValues',
    'changedFields',
    'description',
    'createdAt',
  ];
}

const LOGS = gql`
  query AuditLogs {
    auditLogs {
      id
      userId
      userEmail
      userRole
      entityType
      entityId
      action
      oldValues
      newValues
      changedFields
      description
      createdAt
    }
  }
`;

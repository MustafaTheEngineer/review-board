import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { gql } from 'apollo-angular';
import { Item, ItemGQL, ItemStatus, Role, UpdateItemStatusGQL } from '../../graphql/generated';
import { catchError, map, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  TuiAppearance,
  TuiButton,
  TuiDataList,
  TuiDropdown,
  TuiTextfield,
  TuiTitle,
} from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import {
  TuiChevron,
  TuiChip,
  TuiComboBox,
  TuiDataListWrapper,
  TuiFilterByInputPipe,
  TuiStringifyContentPipe,
  TuiStringifyPipe,
} from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../item-service';
import { AppService } from '../app-service';
import { ErrorService } from '../error-service';

@Component({
  selector: 'app-item-details',
  imports: [
    TuiAppearance,
    TuiCardLarge,
    TuiHeader,
    TuiTitle,
    TuiButton,
    TuiChevron,
    TuiDataList,
    TuiDropdown,
    FormsModule,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiTextfield,
    TuiComboBox,
    TuiChip,
    TuiStringifyContentPipe,
  ],
  templateUrl: './item-details.html',
  styleUrl: './item-details.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDetails {
  route = inject(ActivatedRoute);
  router = inject(Router);
  itemGQL = inject(ItemGQL);
  updateItemStatusGQL = inject(UpdateItemStatusGQL);
  itemService = inject(ItemService);
  appService = inject(AppService);
  errorService = inject(ErrorService);

  Role = Role;

  itemStatus = signal(ItemStatus.New);

  private id$ = this.route.paramMap.pipe(map((paramMap) => paramMap.get('id')));
  id = toSignal(this.id$, {
    initialValue: null,
  });

  item = toSignal(
    this.id$.pipe(
      switchMap((id) => {
        if (!id) {
          this.router.navigate(['home', 'item']);
          throw new Error('Invalid item ID');
        }

        return this.itemGQL
          .fetch({
            fetchPolicy: 'network-only',
            variables: {
              id,
            },
          })
          .pipe(
            catchError((error) => {
              this.router.navigate(['home', 'item']);
              throw new Error('Failed to fetch item details');
            }),
            map((data) => {
              if (!data.data?.item) {
                this.router.navigate(['home', 'item']);
                throw new Error('Invalid item ID');
              }
              this.itemStatus.set(data.data.item.status);

              return data.data.item;
            }),
          );
      }),
    ),
  );

  updateItemStatus() {
    const id = this.id();
    if (!id) {
      return;
    }

    this.updateItemStatusGQL
      .mutate({
        fetchPolicy: 'network-only',
        variables: {
          id: id,
          status: this.itemStatus(),
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

          return of(new Error('Failed to update item status'));
        }),
      )
      .subscribe((result) => {
        if (!(result instanceof Error)) {
          this.errorService.alerts
            .open(`<strong>Item Status Updated</strong>`, {
              appearance: 'positive',
              autoClose: 5000,
            })
            .subscribe();
        }
      });
  }
}

const ITEM = gql`
  query Item($id: ID!) {
    item(id: $id) {
      id
      creatorID
      title
      description
      amount
      status
      deletedByUserID
      deletedAt
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_ITEM_STATUS = gql`
  mutation UpdateItemStatus($id: ID!, $status: ItemStatus!) {
    updateItemStatus(id: $id, status: $status) {
      id
      creatorID
      title
      description
      amount
      status
      deletedByUserID
      deletedAt
      createdAt
      updatedAt
    }
  }
`;

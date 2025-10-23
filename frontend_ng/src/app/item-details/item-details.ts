import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { gql } from 'apollo-angular';
import { Item, ItemGQL, ItemStatus } from '../../graphql/generated';
import { catchError, map, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { TuiAppearance, TuiButton, TuiDataList, TuiDropdown, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { TuiChevron, TuiChip, TuiComboBox, TuiDataListWrapper, TuiFilterByInputPipe, TuiStringifyContentPipe, TuiStringifyPipe } from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../item-service';

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
  itemService = inject(ItemService)

  itemStatus = signal(ItemStatus.New);

  item = toSignal(
    this.route.paramMap.pipe(
      switchMap((paramMap) => {
        const id = paramMap.get('id');
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

import { AsyncPipe, KeyValuePipe, NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TUI_DEFAULT_MATCHER, tuiCountFilledControls, TuiItem, TuiPlatform } from '@taiga-ui/cdk';
import {
  TuiAccessor,
  TuiAppearance,
  TuiButton,
  TuiDataList,
  TuiTextfield,
  TuiTextfieldDropdownDirective,
  TuiTitle,
} from '@taiga-ui/core';
import {
  TuiBadge,
  TuiChevron,
  TuiChip,
  TuiDataListWrapper,
  TuiFilter,
  TuiFilterByInputPipe,
  TuiInputChip,
  TuiMultiSelect,
  TuiSelect,
  TuiStringifyContentPipe,
} from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader, TuiSearch } from '@taiga-ui/layout';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import {
  Item,
  ItemsGQL,
  ItemsResponse,
  ItemStatus,
  Tag,
  TagsGQL,
  User,
  UsersGQL,
  UsersQuery,
} from '../../graphql/generated';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TuiAmountPipe } from '@taiga-ui/addon-commerce';
import { gql } from 'apollo-angular';
import { RouterLink } from '@angular/router';
import { ItemService } from '../item-service';
import { TuiArcChart, TuiRingChart } from '@taiga-ui/addon-charts';

@Component({
  selector: 'app-search-item',
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiChevron,
    TuiDataListWrapper,
    TuiFilter,
    ScrollingModule,
    TuiDataList,
    TuiSearch,
    TuiTextfield,
    TuiSelect,
    TuiMultiSelect,
    TuiFilterByInputPipe,
    TuiInputChip,
    TuiTextfieldDropdownDirective,
    TuiStringifyContentPipe,
    TuiAppearance,
    TuiCardLarge,
    TuiHeader,
    TuiTitle,
    TuiChip,
    RouterLink,
    TuiRingChart,
    TuiBadge,
  ],
  templateUrl: './search-item.html',
  styleUrl: './search-item.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchItem {
  usersGQL = inject(UsersGQL);
  tagsGQL = inject(TagsGQL);
  itemsGQL = inject(ItemsGQL);
  itemService = inject(ItemService);

  usersMap = signal(new Map<string, UserPartial>());
  fetchItems$ = this.itemsGQL.fetch({
    fetchPolicy: 'network-only',
  });
  fetchItemsWithUsers$ = this.fetchItems$.pipe(
    catchError((error) => {
      return of(new Error(error.message));
    }),
    switchMap((response) => {
      if (response instanceof Error) {
        return of(response);
      }

      if (!response.data?.items) {
        return of(response);
      }

      this.items.set(response.data.items);

      const userEmails: string[] = [];
      response.data.items.forEach((item) => {
        if (!this.usersMap().get(item.item.creatorID)) {
          userEmails.push(item.item.creatorID);
        }
      });

      return this.usersGQL
        .fetch({
          fetchPolicy: 'network-only',
          variables: {
            query: {
              ids: userEmails,
            },
          },
        })
        .pipe(
          catchError((error) => {
            return of(new Error(error.message));
          }),
          tap((response) => {
            if (!(response instanceof Error)) {
              if (response.data?.users) {
                response.data.users.forEach((user) => {
                  this.usersMap().set(user.id, user);
                });
                this.usersMap.update((usersMap) => new Map(usersMap));
              }
            }
          }),
        );
    }),
  );

  constructor() {
    this.usersGQL
      .fetch({
        fetchPolicy: 'network-only',
      })
      .pipe(
        catchError((error) => {
          return of(new Error(error.message));
        }),
      )
      .subscribe((response) => {
        if (!(response instanceof Error)) {
          if (response.data?.users) {
            this.users.set(response.data.users);
          }
        }
      });

    this.tagsGQL
      .fetch({
        fetchPolicy: 'network-only',
      })
      .pipe(
        catchError((error) => {
          return of(new Error(error.message));
        }),
      )
      .subscribe((response) => {
        if (!(response instanceof Error)) {
          if (response.data?.tags) {
            this.tags.set(response.data.tags);
          }
        }
      });

    this.fetchItemsWithUsers$.subscribe();
  }

  protected readonly form = new FormGroup({
    itemName: new FormControl('', {
      nonNullable: true,
    }),
    selectedUsers: new FormControl<UserPartial[]>([], {
      nonNullable: true,
    }),
    selectedTags: new FormControl<Tag[]>([], {
      nonNullable: true,
    }),
    itemStatus: new FormControl<ItemStatus[]>([], {
      nonNullable: true,
    }),
  });

  protected readonly users = signal<UserPartial[]>([]);
  protected readonly userspreventArbitrary = (user: UserPartial): boolean =>
    this.users().find((arrUser) => arrUser.id === user.id) === undefined;
  protected readonly userStringify = (user: UserPartial): string =>
    `${user.email} - ${user.username}`;

  queryUsers(event: Event) {
    const value = (event.currentTarget as HTMLInputElement).value;
    this.usersGQL
      .fetch({
        fetchPolicy: 'network-only',
        variables: {
          query: {
            emailLike: value,
            usernameLike: value,
          },
        },
      })
      .pipe(
        catchError((error) => {
          return of(new Error(error.message));
        }),
      )
      .subscribe((response) => {
        if (!(response instanceof Error)) {
          if (response.data?.users) {
            this.users.set(response.data.users);
            response.data.users.forEach((user) => {
              this.usersMap().set(user.id, user);
            });
            this.usersMap.update((usersMap) => new Map(usersMap));
          }
        }
      });
  }

  protected readonly tags = signal<Tag[]>([]);
  protected readonly tagspreventArbitrary = (tag: Tag): boolean =>
    this.tags().find((arrTag) => arrTag.id === tag.id) === undefined;
  protected readonly tagStringify = (tag: Tag): string => tag.name;
  queryTags(event: Event) {
    const value = (event.currentTarget as HTMLInputElement).value;
    this.tagsGQL
      .fetch({
        fetchPolicy: 'network-only',
        variables: {
          query: {
            like: value,
          },
        },
      })
      .pipe(
        catchError((error) => {
          return of(new Error(error.message));
        }),
      )
      .subscribe((response) => {
        if (!(response instanceof Error)) {
          if (response.data?.tags) {
            this.tags.set(response.data.tags);
          }
        }
      });
  }

  protected readonly statusFilters = Object.values(ItemStatus).map((status) =>
    status.replaceAll('_', ' '),
  );

  protected readonly count = toSignal(
    this.form.valueChanges.pipe(map(() => tuiCountFilledControls(this.form))),
    { initialValue: 0 },
  );

  onSubmit() {
    const { itemName, selectedUsers, selectedTags, itemStatus } = this.form.value;

    this.itemsGQL
      .fetch({
        fetchPolicy: 'network-only',
        variables: {
          query: {
            like: itemName,
            users: !selectedUsers?.length ? undefined : selectedUsers.map((user) => user.id),
            tags: !selectedTags?.length ? undefined : selectedTags.map((tag) => tag.id),
            statuses: !itemStatus || !itemStatus.length ? [] : itemStatus,
          },
        },
      })
      .pipe(
        catchError((error) => {
          return of(new Error(error.message));
        }),
        switchMap((response) => {
          if (response instanceof Error) {
            return of(response);
          }

          if (!response.data?.items) {
            return of(response);
          }

          this.items.set(response.data.items);

          const userEmails: string[] = [];
          response.data.items.forEach((item) => {
            if (!this.usersMap().get(item.item.creatorID)) {
              userEmails.push(item.item.creatorID);
            }
          });

          return this.usersGQL
            .fetch({
              fetchPolicy: 'network-only',
              variables: {
                query: {
                  ids: userEmails,
                },
              },
            })
            .pipe(
              catchError((error) => {
                return of(new Error(error.message));
              }),
              tap((response) => {
                if (!(response instanceof Error)) {
                  if (response.data?.users) {
                    response.data.users.forEach((user) => {
                      this.usersMap().set(user.id, user);
                    });
                    this.usersMap.update((usersMap) => new Map(usersMap));
                  }
                }
              }),
            );
        }),
      )
      .subscribe();
  }

  items = signal<ItemsResponse[]>([]);
}

type UserPartial = Pick<User, 'id' | 'username' | 'email'>;

const USERS = gql`
  query Users($query: UsersInput) {
    users(query: $query) {
      id
      username
      email
    }
  }
`;

const ITEMS = gql`
  query Items($query: ItemsRequest) {
    items(query: $query) {
      item {
        id
        creatorID
        deletedByUserID
        title
        description
        amount
        riskScore
        status
        deletedAt
        createdAt
        updatedAt
      }
      tags {
        id
        name
      }
    }
  }
`;

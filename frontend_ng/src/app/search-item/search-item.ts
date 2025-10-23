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
import { TUI_DEFAULT_MATCHER, tuiCountFilledControls, TuiItem } from '@taiga-ui/cdk';
import {
  TuiButton,
  TuiDataList,
  TuiIcon,
  TuiLink,
  TuiScrollable,
  TuiSelectLike,
  TuiTextfield,
  TuiTextfieldDropdownDirective,
} from '@taiga-ui/core';
import {
  TuiChevron,
  TuiDataListWrapper,
  TuiFilter,
  TuiFilterByInputPipe,
  TuiHideSelectedPipe,
  TuiInputChip,
  TuiMultiSelect,
  TuiSegmented,
  TuiSelect,
  TuiStringifyContentPipe,
  TuiSwitch,
} from '@taiga-ui/kit';
import { TuiSearch } from '@taiga-ui/layout';
import { catchError, map, of } from 'rxjs';
import {
  ItemsGQL,
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

@Component({
  selector: 'app-search-item',
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiChevron,
    TuiDataListWrapper,
    TuiFilter,
    TuiLink,
    TuiIcon,
    ScrollingModule,
    TuiDataList,
    TuiScrollable,
    TuiSearch,
    TuiSegmented,
    TuiSwitch,
    TuiTextfield,
    TuiSelect,
    TuiMultiSelect,
    TuiAmountPipe,
    AsyncPipe,
    TuiFilterByInputPipe,
    TuiInputChip,
    TuiSelectLike,
    TuiItem,
    TuiTextfieldDropdownDirective,
    TuiHideSelectedPipe,
    TuiStringifyContentPipe,
    KeyValuePipe,
  ],
  templateUrl: './search-item.html',
  styleUrl: './search-item.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchItem {
  usersGQL = inject(UsersGQL);
  tagsGQL = inject(TagsGQL);
  itemsGQL = inject(ItemsGQL);

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

  itemStatuses = Object.values(ItemStatus);
  statusesStringify = (status: ItemStatus): string => Object.values(status)[0].replaceAll('_', ' ');

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
      )
      .subscribe((result) => {
        console.log(result);
      });
  }

  protected readonly count = toSignal(
    this.form.valueChanges.pipe(map(() => tuiCountFilledControls(this.form))),
    { initialValue: 0 },
  );
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
      id
      title
      description
      amount
      status
      createdAt
      updatedAt
    }
  }
`;

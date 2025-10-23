import { Injectable } from '@angular/core';
import { ItemStatus } from '../graphql/generated';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  itemStatuses = Object.values(ItemStatus);
  statusesStringify = (status: ItemStatus): string => Object.values(status)[0].replaceAll('_', ' ');
  readonly statusStringify = (status: ItemStatus): string => status.replaceAll('_', ' ');

  itemStatusColor(status: ItemStatus) {
    switch (status) {
      case ItemStatus.Approved:
        return 'positive';
      case ItemStatus.InReview:
        return 'warning';
      case ItemStatus.New:
        return 'info';
      case ItemStatus.Rejected:
        return 'negative';
      default:
        return 'primary';
    }
  }
}

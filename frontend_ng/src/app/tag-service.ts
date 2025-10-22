import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class TagService {}

const TAGS = gql`
  query Tags($query: TagsInput) {
    tags(query: $query) {
      id
      name
    }
  }
`;

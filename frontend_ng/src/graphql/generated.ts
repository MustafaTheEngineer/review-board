import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Any: { input: any; output: any; }
  Date: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

export type ConfirmUserInput = {
  confirmationCode: Scalars['String']['input'];
};

export type ConfirmUserResponse = {
  __typename?: 'ConfirmUserResponse';
  message: Scalars['String']['output'];
  user: User;
};

export type CreateItemRequest = {
  amount: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  tags: Array<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateItemResponse = {
  __typename?: 'CreateItemResponse';
  item: Item;
  tags: Array<Scalars['String']['output']>;
};

export type Item = {
  __typename?: 'Item';
  amount: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  status: ItemStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export enum ItemStatus {
  Approved = 'APPROVED',
  InReview = 'IN_REVIEW',
  New = 'NEW',
  Rejected = 'REJECTED'
}

export type Mutation = {
  __typename?: 'Mutation';
  confirmUser: ConfirmUserResponse;
  createItem?: Maybe<CreateItemResponse>;
  registerUser: RegisterUserResponse;
  setUsername: SetUsernameResponse;
  signIn: SignInResponse;
};


export type MutationConfirmUserArgs = {
  input: ConfirmUserInput;
};


export type MutationCreateItemArgs = {
  input: CreateItemRequest;
};


export type MutationRegisterUserArgs = {
  input: NewUser;
};


export type MutationSetUsernameArgs = {
  username: Scalars['String']['input'];
};


export type MutationSignInArgs = {
  input: SignInInput;
};

export type NewUser = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  isUsernameTaken: Scalars['Boolean']['output'];
  tags: Array<Tag>;
  userConfirmed: Scalars['Boolean']['output'];
  userHaveUsername: Scalars['Boolean']['output'];
  users: Array<User>;
  validateToken: TokenValidationResponse;
};


export type QueryIsUsernameTakenArgs = {
  username: Scalars['String']['input'];
};


export type QueryTagsArgs = {
  query?: InputMaybe<TagsInput>;
};


export type QueryUsersArgs = {
  query?: InputMaybe<UsersInput>;
};

export type RegisterUserResponse = {
  __typename?: 'RegisterUserResponse';
  message: Scalars['String']['output'];
  user: User;
};

export type SetUsernameResponse = {
  __typename?: 'SetUsernameResponse';
  message: Scalars['String']['output'];
  user: User;
};

export type SignInInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignInResponse = {
  __typename?: 'SignInResponse';
  message: Scalars['String']['output'];
  user: User;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type TagsInput = {
  like?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type TokenValidationResponse = {
  __typename?: 'TokenValidationResponse';
  user: User;
};

export type User = {
  __typename?: 'User';
  blocked: Scalars['Boolean']['output'];
  confirmed: Scalars['Boolean']['output'];
  email: Scalars['String']['output'];
  role: Scalars['String']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type UsersInput = {
  emailLike?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  usernameLike?: InputMaybe<Scalars['String']['input']>;
};

export type ValidateTokenQueryVariables = Exact<{ [key: string]: never; }>;


export type ValidateTokenQuery = { __typename?: 'Query', validateToken: { __typename?: 'TokenValidationResponse', user: { __typename?: 'User', email: string, username?: string | null, confirmed: boolean, blocked: boolean, role: string } } };

export type UserConfirmedQueryVariables = Exact<{ [key: string]: never; }>;


export type UserConfirmedQuery = { __typename?: 'Query', userConfirmed: boolean };

export type UserHaveUsernameQueryVariables = Exact<{ [key: string]: never; }>;


export type UserHaveUsernameQuery = { __typename?: 'Query', userHaveUsername: boolean };

export type IsUsernameTakenQueryVariables = Exact<{
  input: Scalars['String']['input'];
}>;


export type IsUsernameTakenQuery = { __typename?: 'Query', isUsernameTaken: boolean };

export type SetUsernameMutationVariables = Exact<{
  input: Scalars['String']['input'];
}>;


export type SetUsernameMutation = { __typename?: 'Mutation', setUsername: { __typename?: 'SetUsernameResponse', message: string, user: { __typename?: 'User', email: string, username?: string | null, confirmed: boolean, blocked: boolean } } };

export type ConfirmUserMutationVariables = Exact<{
  input: ConfirmUserInput;
}>;


export type ConfirmUserMutation = { __typename?: 'Mutation', confirmUser: { __typename?: 'ConfirmUserResponse', message: string, user: { __typename?: 'User', email: string, username?: string | null, role: string, confirmed: boolean } } };

export type RegisterUserMutationVariables = Exact<{
  input: NewUser;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'RegisterUserResponse', message: string, user: { __typename?: 'User', email: string, username?: string | null, confirmed: boolean, blocked: boolean, role: string } } };

export type SignInMutationVariables = Exact<{
  input: SignInInput;
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'SignInResponse', message: string, user: { __typename?: 'User', email: string, username?: string | null, confirmed: boolean, blocked: boolean, role: string } } };

export type CreateItemMutationVariables = Exact<{
  input: CreateItemRequest;
}>;


export type CreateItemMutation = { __typename?: 'Mutation', createItem?: { __typename?: 'CreateItemResponse', tags: Array<string>, item: { __typename?: 'Item', id: string, title: string, description?: string | null, amount: string, status: ItemStatus, createdAt: any, updatedAt: any } } | null };

export type UsersQueryVariables = Exact<{
  query?: InputMaybe<UsersInput>;
}>;


export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', username?: string | null, email: string }> };

export type TagsQueryVariables = Exact<{
  query?: InputMaybe<TagsInput>;
}>;


export type TagsQuery = { __typename?: 'Query', tags: Array<{ __typename?: 'Tag', id: string, name: string }> };

export const ValidateTokenDocument = gql`
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

  @Injectable({
    providedIn: 'root'
  })
  export class ValidateTokenGQL extends Apollo.Query<ValidateTokenQuery, ValidateTokenQueryVariables> {
    document = ValidateTokenDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UserConfirmedDocument = gql`
    query UserConfirmed {
  userConfirmed
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UserConfirmedGQL extends Apollo.Query<UserConfirmedQuery, UserConfirmedQueryVariables> {
    document = UserConfirmedDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UserHaveUsernameDocument = gql`
    query UserHaveUsername {
  userHaveUsername
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UserHaveUsernameGQL extends Apollo.Query<UserHaveUsernameQuery, UserHaveUsernameQueryVariables> {
    document = UserHaveUsernameDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const IsUsernameTakenDocument = gql`
    query IsUsernameTaken($input: String!) {
  isUsernameTaken(username: $input)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IsUsernameTakenGQL extends Apollo.Query<IsUsernameTakenQuery, IsUsernameTakenQueryVariables> {
    document = IsUsernameTakenDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SetUsernameDocument = gql`
    mutation SetUsername($input: String!) {
  setUsername(username: $input) {
    message
    user {
      email
      username
      confirmed
      blocked
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SetUsernameGQL extends Apollo.Mutation<SetUsernameMutation, SetUsernameMutationVariables> {
    document = SetUsernameDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ConfirmUserDocument = gql`
    mutation ConfirmUser($input: ConfirmUserInput!) {
  confirmUser(input: $input) {
    message
    user {
      email
      username
      role
      confirmed
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ConfirmUserGQL extends Apollo.Mutation<ConfirmUserMutation, ConfirmUserMutationVariables> {
    document = ConfirmUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RegisterUserDocument = gql`
    mutation RegisterUser($input: NewUser!) {
  registerUser(input: $input) {
    message
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

  @Injectable({
    providedIn: 'root'
  })
  export class RegisterUserGQL extends Apollo.Mutation<RegisterUserMutation, RegisterUserMutationVariables> {
    document = RegisterUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SignInDocument = gql`
    mutation SignIn($input: SignInInput!) {
  signIn(input: $input) {
    message
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

  @Injectable({
    providedIn: 'root'
  })
  export class SignInGQL extends Apollo.Mutation<SignInMutation, SignInMutationVariables> {
    document = SignInDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateItemDocument = gql`
    mutation CreateItem($input: CreateItemRequest!) {
  createItem(input: $input) {
    item {
      id
      title
      description
      amount
      status
      createdAt
      updatedAt
    }
    tags
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateItemGQL extends Apollo.Mutation<CreateItemMutation, CreateItemMutationVariables> {
    document = CreateItemDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UsersDocument = gql`
    query Users($query: UsersInput) {
  users(query: $query) {
    username
    email
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UsersGQL extends Apollo.Query<UsersQuery, UsersQueryVariables> {
    document = UsersDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const TagsDocument = gql`
    query Tags($query: TagsInput) {
  tags(query: $query) {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class TagsGQL extends Apollo.Query<TagsQuery, TagsQueryVariables> {
    document = TagsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
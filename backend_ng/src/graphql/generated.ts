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
  Int64: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

export type ApiResponse = {
  __typename?: 'ApiResponse';
  code: Scalars['Int']['output'];
  data?: Maybe<Scalars['Any']['output']>;
  message: Scalars['String']['output'];
  status: RequestStatus;
};

export type MetaAndToken = {
  metadata: ApiResponse;
  token: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  registerUser: RegisterUserResponse;
  signIn: SignInResponse;
};


export type MutationRegisterUserArgs = {
  input: NewUser;
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
  user: Scalars['String']['output'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type RegisterUserResponse = MetaAndToken & {
  __typename?: 'RegisterUserResponse';
  metadata: ApiResponse;
  token: Scalars['String']['output'];
  user: User;
};

export enum RequestStatus {
  Error = 'ERROR',
  Success = 'SUCCESS'
}

export type SignInInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignInResponse = MetaAndToken & {
  __typename?: 'SignInResponse';
  metadata: ApiResponse;
  token: Scalars['String']['output'];
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

export type RegisterUserMutationVariables = Exact<{
  input: NewUser;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'RegisterUserResponse', token: string, metadata: { __typename?: 'ApiResponse', code: number, status: RequestStatus, message: string, data?: any | null }, user: { __typename?: 'User', email: string, username?: string | null, confirmed: boolean, blocked: boolean, role: string } } };

export type SignInMutationVariables = Exact<{
  input: SignInInput;
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'SignInResponse', token: string, metadata: { __typename?: 'ApiResponse', code: number, status: RequestStatus, message: string, data?: any | null }, user: { __typename?: 'User', email: string, username?: string | null, confirmed: boolean, blocked: boolean, role: string } } };

export const RegisterUserDocument = gql`
    mutation RegisterUser($input: NewUser!) {
  registerUser(input: $input) {
    metadata {
      code
      status
      message
      data
    }
    user {
      email
      username
      confirmed
      blocked
      role
    }
    token
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
    metadata {
      code
      status
      message
      data
    }
    user {
      email
      username
      confirmed
      blocked
      role
    }
    token
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
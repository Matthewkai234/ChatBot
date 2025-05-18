/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateConversation = /* GraphQL */ `
  subscription OnCreateConversation(
    $filter: ModelSubscriptionConversationFilterInput
    $owner: String
  ) {
    onCreateConversation(filter: $filter, owner: $owner) {
      id
      name
      description
      user
      utterances {
        items {
          id
          text
          isBot
          conversationId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onUpdateConversation = /* GraphQL */ `
  subscription OnUpdateConversation(
    $filter: ModelSubscriptionConversationFilterInput
    $owner: String
  ) {
    onUpdateConversation(filter: $filter, owner: $owner) {
      id
      name
      description
      user
      utterances {
        items {
          id
          text
          isBot
          conversationId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onDeleteConversation = /* GraphQL */ `
  subscription OnDeleteConversation(
    $filter: ModelSubscriptionConversationFilterInput
    $owner: String
  ) {
    onDeleteConversation(filter: $filter, owner: $owner) {
      id
      name
      description
      user
      utterances {
        items {
          id
          text
          isBot
          conversationId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onCreateUtterance = /* GraphQL */ `
  subscription OnCreateUtterance(
    $filter: ModelSubscriptionUtteranceFilterInput
    $owner: String
  ) {
    onCreateUtterance(filter: $filter, owner: $owner) {
      id
      text
      isBot
      conversationId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onUpdateUtterance = /* GraphQL */ `
  subscription OnUpdateUtterance(
    $filter: ModelSubscriptionUtteranceFilterInput
    $owner: String
  ) {
    onUpdateUtterance(filter: $filter, owner: $owner) {
      id
      text
      isBot
      conversationId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onDeleteUtterance = /* GraphQL */ `
  subscription OnDeleteUtterance(
    $filter: ModelSubscriptionUtteranceFilterInput
    $owner: String
  ) {
    onDeleteUtterance(filter: $filter, owner: $owner) {
      id
      text
      isBot
      conversationId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onCreateUserPreferences = /* GraphQL */ `
  subscription OnCreateUserPreferences(
    $filter: ModelSubscriptionUserPreferencesFilterInput
    $owner: String
  ) {
    onCreateUserPreferences(filter: $filter, owner: $owner) {
      userId
      preferredRegion
      updatedAt
      createdAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onUpdateUserPreferences = /* GraphQL */ `
  subscription OnUpdateUserPreferences(
    $filter: ModelSubscriptionUserPreferencesFilterInput
    $owner: String
  ) {
    onUpdateUserPreferences(filter: $filter, owner: $owner) {
      userId
      preferredRegion
      updatedAt
      createdAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onDeleteUserPreferences = /* GraphQL */ `
  subscription OnDeleteUserPreferences(
    $filter: ModelSubscriptionUserPreferencesFilterInput
    $owner: String
  ) {
    onDeleteUserPreferences(filter: $filter, owner: $owner) {
      userId
      preferredRegion
      updatedAt
      createdAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;

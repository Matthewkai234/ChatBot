import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier, CustomIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";





type EagerConversation = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Conversation, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly user: string;
  readonly utterances?: (Utterance | null)[] | null;
  readonly createdAt: string;
  readonly updatedAt?: string | null;
}

type LazyConversation = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Conversation, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly user: string;
  readonly utterances: AsyncCollection<Utterance>;
  readonly createdAt: string;
  readonly updatedAt?: string | null;
}

export declare type Conversation = LazyLoading extends LazyLoadingDisabled ? EagerConversation : LazyConversation

export declare const Conversation: (new (init: ModelInit<Conversation>) => Conversation) & {
  copyOf(source: Conversation, mutator: (draft: MutableModel<Conversation>) => MutableModel<Conversation> | void): Conversation;
}

type EagerUtterance = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Utterance, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly text: string;
  readonly isBot: boolean;
  readonly conversationId: string;
  readonly createdAt: string;
  readonly updatedAt?: string | null;
}

type LazyUtterance = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Utterance, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly text: string;
  readonly isBot: boolean;
  readonly conversationId: string;
  readonly createdAt: string;
  readonly updatedAt?: string | null;
}

export declare type Utterance = LazyLoading extends LazyLoadingDisabled ? EagerUtterance : LazyUtterance

export declare const Utterance: (new (init: ModelInit<Utterance>) => Utterance) & {
  copyOf(source: Utterance, mutator: (draft: MutableModel<Utterance>) => MutableModel<Utterance> | void): Utterance;
}

type EagerUserPreferences = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<UserPreferences, 'userId'>;
    readOnlyFields: 'createdAt';
  };
  readonly userId: string;
  readonly preferredRegion: string;
  readonly updatedAt: string;
  readonly createdAt?: string | null;
}

type LazyUserPreferences = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<UserPreferences, 'userId'>;
    readOnlyFields: 'createdAt';
  };
  readonly userId: string;
  readonly preferredRegion: string;
  readonly updatedAt: string;
  readonly createdAt?: string | null;
}

export declare type UserPreferences = LazyLoading extends LazyLoadingDisabled ? EagerUserPreferences : LazyUserPreferences

export declare const UserPreferences: (new (init: ModelInit<UserPreferences>) => UserPreferences) & {
  copyOf(source: UserPreferences, mutator: (draft: MutableModel<UserPreferences>) => MutableModel<UserPreferences> | void): UserPreferences;
}
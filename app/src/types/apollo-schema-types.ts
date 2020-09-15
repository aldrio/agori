/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EditAvatarMutation
// ====================================================

export interface EditAvatarMutation_editMe {
  __typename: "User";
  id: string;
  avatarData: string | null;
  avatarThumbnailUrl: string | null;
}

export interface EditAvatarMutation {
  editMe: EditAvatarMutation_editMe;
}

export interface EditAvatarMutationVariables {
  avatarData: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: InterestsToggleQuery
// ====================================================

export interface InterestsToggleQuery_me_interests {
  __typename: "Interest";
  id: string;
}

export interface InterestsToggleQuery_me {
  __typename: "User";
  id: string;
  interests: InterestsToggleQuery_me_interests[];
}

export interface InterestsToggleQuery {
  me: InterestsToggleQuery_me;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddInterestMutation
// ====================================================

export interface AddInterestMutation_addInterest_interests {
  __typename: "Interest";
  id: string;
}

export interface AddInterestMutation_addInterest {
  __typename: "User";
  id: string;
  interests: AddInterestMutation_addInterest_interests[];
}

export interface AddInterestMutation {
  /**
   * Add an interest to user
   */
  addInterest: AddInterestMutation_addInterest;
}

export interface AddInterestMutationVariables {
  interestId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveInterestMutation
// ====================================================

export interface RemoveInterestMutation_removeInterest_interests {
  __typename: "Interest";
  id: string;
}

export interface RemoveInterestMutation_removeInterest {
  __typename: "User";
  id: string;
  interests: RemoveInterestMutation_removeInterest_interests[];
}

export interface RemoveInterestMutation {
  /**
   * Remove an interest to user
   */
  removeInterest: RemoveInterestMutation_removeInterest;
}

export interface RemoveInterestMutationVariables {
  interestId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EditProfileMutation
// ====================================================

export interface EditProfileMutation_editMe_interests {
  __typename: "Interest";
  id: string;
  label: string;
}

export interface EditProfileMutation_editMe {
  __typename: "User";
  id: string;
  avatarData: string | null;
  avatarThumbnailUrl: string | null;
  displayName: string;
  bio: string | null;
  interests: EditProfileMutation_editMe_interests[];
}

export interface EditProfileMutation {
  editMe: EditProfileMutation_editMe;
}

export interface EditProfileMutationVariables {
  displayName?: string | null;
  bio?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ChatQuery
// ====================================================

export interface ChatQuery_me {
  __typename: "User";
  id: string;
}

export interface ChatQuery_privateChat_chatUsers_user {
  __typename: "User";
  id: string;
  displayName: string;
}

export interface ChatQuery_privateChat_chatUsers {
  __typename: "ChatUser";
  id: string;
  user: ChatQuery_privateChat_chatUsers_user;
}

export interface ChatQuery_privateChat_recentMessages_chatUser_user {
  __typename: "User";
  id: string;
  displayName: string;
}

export interface ChatQuery_privateChat_recentMessages_chatUser {
  __typename: "ChatUser";
  id: string;
  user: ChatQuery_privateChat_recentMessages_chatUser_user;
}

export interface ChatQuery_privateChat_recentMessages {
  __typename: "Message";
  id: string;
  chatUser: ChatQuery_privateChat_recentMessages_chatUser;
  createdAt: any;
  updatedAt: any;
  content: string;
}

export interface ChatQuery_privateChat {
  __typename: "Chat";
  id: string;
  chatUsers: ChatQuery_privateChat_chatUsers[];
  recentMessages: ChatQuery_privateChat_recentMessages[];
}

export interface ChatQuery {
  me: ChatQuery_me;
  privateChat: ChatQuery_privateChat;
}

export interface ChatQueryVariables {
  userId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: ChatSubscription
// ====================================================

export interface ChatSubscription_newMessageSent_chatUser_user {
  __typename: "User";
  id: string;
  displayName: string;
}

export interface ChatSubscription_newMessageSent_chatUser {
  __typename: "ChatUser";
  id: string;
  user: ChatSubscription_newMessageSent_chatUser_user;
}

export interface ChatSubscription_newMessageSent {
  __typename: "Message";
  id: string;
  chatUser: ChatSubscription_newMessageSent_chatUser;
  createdAt: any;
  updatedAt: any;
  content: string;
}

export interface ChatSubscription {
  newMessageSent: ChatSubscription_newMessageSent;
}

export interface ChatSubscriptionVariables {
  chatId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SendMessageMutation
// ====================================================

export interface SendMessageMutation_sendNewMessage {
  __typename: "Message";
  content: string;
}

export interface SendMessageMutation {
  sendNewMessage: SendMessageMutation_sendNewMessage;
}

export interface SendMessageMutationVariables {
  chatId: string;
  content: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AvatarQuery
// ====================================================

export interface AvatarQuery_me {
  __typename: "User";
  id: string;
  avatarData: string | null;
  avatarThumbnailUrl: string | null;
}

export interface AvatarQuery {
  me: AvatarQuery_me;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProfileQuery
// ====================================================

export interface ProfileQuery_me_interests {
  __typename: "Interest";
  id: string;
  label: string;
}

export interface ProfileQuery_me {
  __typename: "User";
  id: string;
  avatarData: string | null;
  avatarThumbnailUrl: string | null;
  displayName: string;
  bio: string | null;
  interests: ProfileQuery_me_interests[];
}

export interface ProfileQuery {
  me: ProfileQuery_me;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: InterestsQuery
// ====================================================

export interface InterestsQuery_me_interests {
  __typename: "Interest";
  id: string;
}

export interface InterestsQuery_me {
  __typename: "User";
  id: string;
  interests: InterestsQuery_me_interests[];
}

export interface InterestsQuery_interests {
  __typename: "Interest";
  id: string;
  label: string;
  description: string;
}

export interface InterestsQuery {
  me: InterestsQuery_me;
  interests: InterestsQuery_interests[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MainScreenQuery
// ====================================================

export interface MainScreenQuery_me_chats_myChatUser {
  __typename: "ChatUser";
  id: string;
  lastReadTime: any | null;
}

export interface MainScreenQuery_me_chats_recentMessages_user {
  __typename: "User";
  id: string;
  avatarThumbnailUrl: string | null;
  displayName: string;
}

export interface MainScreenQuery_me_chats_recentMessages {
  __typename: "Message";
  id: string;
  user: MainScreenQuery_me_chats_recentMessages_user;
  createdAt: any;
  content: string;
}

export interface MainScreenQuery_me_chats {
  __typename: "Chat";
  id: string;
  displayName: string | null;
  private: boolean;
  myChatUser: MainScreenQuery_me_chats_myChatUser | null;
  recentMessages: MainScreenQuery_me_chats_recentMessages[];
}

export interface MainScreenQuery_me {
  __typename: "User";
  chats: MainScreenQuery_me_chats[];
}

export interface MainScreenQuery {
  me: MainScreenQuery_me;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchUsersQuery
// ====================================================

export interface SearchUsersQuery_searchUsers_user {
  __typename: "User";
  id: string;
  displayName: string;
  avatarThumbnailUrl: string | null;
}

export interface SearchUsersQuery_searchUsers {
  __typename: "UserSearchResult";
  user: SearchUsersQuery_searchUsers_user;
  interestsInCommon: number;
}

export interface SearchUsersQuery {
  searchUsers: SearchUsersQuery_searchUsers[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserQuery
// ====================================================

export interface UserQuery_user_interests {
  __typename: "Interest";
  id: string;
  label: string;
  description: string;
}

export interface UserQuery_user {
  __typename: "User";
  id: string;
  displayName: string;
  avatarData: string | null;
  bio: string | null;
  interests: UserQuery_user_interests[];
}

export interface UserQuery_me_interests {
  __typename: "Interest";
  id: string;
}

export interface UserQuery_me {
  __typename: "User";
  id: string;
  interests: UserQuery_me_interests[];
}

export interface UserQuery {
  user: UserQuery_user;
  me: UserQuery_me;
}

export interface UserQueryVariables {
  userId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CurrentUserScreenQuery
// ====================================================

export interface CurrentUserScreenQuery_me {
  __typename: "User";
  id: string;
}

export interface CurrentUserScreenQuery {
  me: CurrentUserScreenQuery_me;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: MessageFragment
// ====================================================

export interface MessageFragment_chatUser_user {
  __typename: "User";
  id: string;
  displayName: string;
}

export interface MessageFragment_chatUser {
  __typename: "ChatUser";
  id: string;
  user: MessageFragment_chatUser_user;
}

export interface MessageFragment {
  __typename: "Message";
  id: string;
  chatUser: MessageFragment_chatUser;
  createdAt: any;
  updatedAt: any;
  content: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AvatarFormFragment
// ====================================================

export interface AvatarFormFragment {
  __typename: "User";
  id: string;
  avatarData: string | null;
  avatarThumbnailUrl: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: InterestToggleFragment
// ====================================================

export interface InterestToggleFragment {
  __typename: "Interest";
  id: string;
  label: string;
  description: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProfileFormFragment
// ====================================================

export interface ProfileFormFragment_interests {
  __typename: "Interest";
  id: string;
  label: string;
}

export interface ProfileFormFragment {
  __typename: "User";
  id: string;
  avatarData: string | null;
  avatarThumbnailUrl: string | null;
  displayName: string;
  bio: string | null;
  interests: ProfileFormFragment_interests[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================

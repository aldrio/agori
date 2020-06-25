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
// GraphQL query operation: SearchUsersQuery
// ====================================================

export interface SearchUsersQuery_me {
  __typename: "User";
  id: string;
  displayName: string;
}

export interface SearchUsersQuery_users {
  __typename: "User";
  id: string;
  displayName: string;
}

export interface SearchUsersQuery {
  me: SearchUsersQuery_me;
  users: SearchUsersQuery_users[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserQuery
// ====================================================

export interface UserQuery_user {
  __typename: "User";
  id: string;
  displayName: string;
}

export interface UserQuery {
  user: UserQuery_user;
}

export interface UserQueryVariables {
  userId: string;
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

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================

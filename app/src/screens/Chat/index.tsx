import React, { useState, useEffect } from 'react'
import styles from './styles'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Screen } from 'components/Screen'
import { Button, Input, Icon } from '@ui-kitten/components'
import { useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import {
  SendMessageMutation,
  ChatSubscription,
  SendMessageMutationVariables,
  ChatQuery,
} from 'types/apollo-schema-types'
import { View, ToastAndroid } from 'react-native'
import { Messages } from 'components/Messages'

export const ChatScreenName = 'ChatScreen'
export type ChatScreenParams = {
  userId: string
}
type ChatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof ChatScreenName
>
type ChatScreenRouteProp = RouteProp<RootStackParamList, typeof ChatScreenName>

export type ChatProps = {
  navigation: ChatScreenNavigationProp
  route: ChatScreenRouteProp
}
export const ChatScreen: React.FC<ChatProps> = ({ navigation, route }) => {
  const { data, loading, error, subscribeToMore } = useQuery<ChatQuery>(
    gql`
      query ChatQuery($userId: ID!) {
        me {
          id
        }
        privateChat(userId: $userId) {
          id
          chatUsers {
            id
            user {
              id
              displayName
            }
          }
          recentMessages {
            id
            chatUser {
              id
              user {
                id
                displayName
              }
            }
            createdAt
            updatedAt
            content
          }
        }
      }
    `,
    {
      variables: { userId: route.params.userId },
      partialRefetch: true,
      fetchPolicy: 'cache-and-network',
    }
  )
  useEffect(() => {
    subscribeToMore<ChatSubscription>({
      document: gql`
        subscription ChatSubscription {
          newMessageSent {
            id
            chatUser {
              id
              user {
                id
                displayName
              }
            }
            createdAt
            updatedAt
            content
          }
        }
      `,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        return {
          ...prev,
          privateChat: {
            ...prev.privateChat,
            recentMessages: [
              subscriptionData.data.newMessageSent,
              ...prev.privateChat.recentMessages,
            ],
          },
        }
      },
    })
  }, [subscribeToMore])

  const [sendMessage, sendMessageRes] = useMutation<
    SendMessageMutation,
    SendMessageMutationVariables
  >(
    gql`
      mutation SendMessageMutation($chatId: ID!, $content: String!) {
        sendNewMessage(chatId: $chatId, newMessage: { content: $content }) {
          content
        }
      }
    `
  )

  const [input, setInput] = useState('')

  if (loading) {
    return <Screen title="Chat" loading />
  }
  if (error) {
    return <Screen title="Chat" error={error.message} />
  }
  if (!data) {
    return null
  }

  const SendIcon = (props: any) => <Icon {...props} name="paper-plane" />

  const sendDisabled = input.length === 0

  const submit = async () => {
    setInput('')
    try {
      await sendMessage({
        variables: {
          chatId: data.privateChat.id,
          content: input,
        },
      })
    } catch (error) {
      ToastAndroid.show('Error sending message', ToastAndroid.SHORT)
      setInput(input)
    }
  }

  return (
    <Screen
      title={data.privateChat.chatUsers[1].user.displayName}
      subTitle="Chats"
      back
      noScroll
      padding={false}
    >
      <Messages myId={data.me.id} messages={data.privateChat.recentMessages} />

      <View style={styles.input}>
        <Input
          multiline
          placeholder="Send"
          value={input}
          onChangeText={setInput}
          style={styles.inputText}
        />
        <Button
          style={[styles.iconButton, styles.sendButton]}
          accessoryLeft={SendIcon}
          disabled={sendMessageRes.loading || sendDisabled}
          onPress={submit}
        />
      </View>
    </Screen>
  )
}

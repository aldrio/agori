import React from 'react'
import styles from './styles'
import { View } from 'react-native'
import { Text, Button } from '@ui-kitten/components'
import gql from 'graphql-tag'
import { MessageFragment } from 'types/apollo-schema-types'

export const MessageGqlFragment = gql`
  fragment MessageFragment on Message {
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
`

export type MessageProps = {
  myId: string
  message: MessageFragment
}
export const Message: React.FC<MessageProps> = ({ myId, message }) => {
  const myMessage = myId === message.chatUser.user.id
  return (
    <View style={[styles.message]}>
      <View
        style={[
          styles.messageBubble,
          myMessage ? styles.myMessageBubble : styles.theirMessageBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            myMessage ? styles.myMessageText : styles.theirMessageText,
          ]}
        >
          {message.content}
        </Text>
      </View>
      <View
        style={[
          styles.messageBubbleThingy,
          myMessage
            ? styles.myMessageBubbleThingy
            : styles.theirMessageBubbleThingy,
        ]}
      />
    </View>
  )
}

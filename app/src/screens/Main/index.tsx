import React from 'react'
import styles from './styles'
import { Image } from 'react-native'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Screen } from 'components/Screen'
import { ListItem, List } from '@ui-kitten/components'
import { useQuery } from '@apollo/client'
import {
  MainScreenQuery,
  MainScreenQuery_me_chats,
} from 'types/apollo-schema-types'
import gql from 'graphql-tag'
import { UnknownAvatarDesign } from 'components/UnknownAvatarDesign'

export const MainScreenName = 'MainScreen'
export type MainScreenParams = {}
type MainScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof MainScreenName
>
type MainScreenRouteProp = RouteProp<RootStackParamList, typeof MainScreenName>

export type MainProps = {
  navigation: MainScreenNavigationProp
  route: MainScreenRouteProp
}
export const MainScreen: React.FC<MainProps> = () => {
  const { data, loading, error, refetch } = useQuery<MainScreenQuery>(
    gql`
      query MainScreenQuery {
        me {
          chats {
            id
            displayName
            private
            myChatUser {
              id
              lastReadTime
            }
            recentMessages(markRead: false, count: 1) {
              id
              user {
                id
                avatarThumbnailUrl
                displayName
              }
              createdAt
              content
            }
          }
        }
      }
    `,
    {
      fetchPolicy: 'network-only',
    }
  )

  let body
  if (data) {
    const { chats } = data.me

    const readChats: MainScreenQuery_me_chats[] = []
    const unreadChats: MainScreenQuery_me_chats[] = []

    chats.forEach((chat) => {
      if (chat.recentMessages.length > 0 && chat.myChatUser) {
        const { lastReadTime } = chat.myChatUser
        if (chat.recentMessages[0].createdAt > lastReadTime) {
          unreadChats.push(chat)
          return
        }
      }

      readChats.push(chat)
    })
    body = (
      <>
        <List<MainScreenQuery_me_chats>
          data={unreadChats}
          renderItem={({ item: chat }) => {
            const message = chat.recentMessages[0]
            const author = message.user
            return (
              <ListItem
                key={chat.id}
                title={message.user.displayName}
                description={message.content}
                accessoryLeft={(props) =>
                  author.avatarThumbnailUrl ? (
                    <Image
                      {...props}
                      source={{ uri: author.avatarThumbnailUrl }}
                      resizeMode="contain"
                      style={{ aspectRatio: 1, width: '100%' }}
                    />
                  ) : (
                    <UnknownAvatarDesign size="100%" {...props} />
                  )
                }
              />
            )
          }}
        />
      </>
    )
  }

  return (
    <Screen
      title="Main"
      onRefresh={refetch}
      loading={loading}
      error={error?.message}
    >
      {body}
    </Screen>
  )
}

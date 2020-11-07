import React, { useCallback, useState } from 'react'
import styles from './styles'
import { View, Image, LayoutChangeEvent } from 'react-native'
import { Button, Icon, Input, Text } from '@ui-kitten/components'
import gql from 'graphql-tag'
import { PostFragment } from 'types/apollo-schema-types'
import { UnknownAvatarDesign } from 'components/UnknownAvatarDesign'
import dayjs from 'dayjs'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'

const SendIcon = (props: any) => <Icon {...props} name="paper-plane" />

export const PostGqlFragment = gql`
  fragment PostFragment on Post {
    id
    createdAt
    updatedAt
    content
    user {
      id
      displayName
      avatarThumbnailUrl
    }
  }
`

export type PostProps = {
  post: PostFragment & { childrenPosts?: PostFragment[] }
  comment?: boolean
}
export const Post: React.FC<PostProps> = ({ post, comment = false }) => {
  const { user } = post
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  // Show reply field when there's already children
  const [reply, setReply] = useState((post.childrenPosts?.length || 0) > 0)

  const navigateToUser = useCallback(() => {
    navigation.navigate('UserScreen', { userId: post.user.id })
  }, [post.user.id, navigation])

  return (
    <View style={[styles.post, !comment && styles.postBorder]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateToUser}>
          {user.avatarThumbnailUrl ? (
            <Image
              source={{ uri: user.avatarThumbnailUrl }}
              style={{ width: comment ? 50 : 72, height: comment ? 50 : 72 }}
              resizeMode="contain"
            />
          ) : (
            <UnknownAvatarDesign size={comment ? 50 : 72} />
          )}
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <TouchableOpacity onPress={navigateToUser}>
            <Text style={styles.displayNameText} numberOfLines={1}>
              {user.displayName}
            </Text>
          </TouchableOpacity>
          <Text numberOfLines={1}>
            <Text style={styles.createdAtText}>
              {(dayjs(post.createdAt) as any).fromNow()}
            </Text>
            {post.updatedAt !== post.createdAt ? (
              <Text style={styles.updatedAtText}>
                {' '}
                Edited {(dayjs(post.updatedAt) as any).fromNow()}
              </Text>
            ) : (
              ''
            )}
          </Text>
        </View>
        <View style={styles.headerMore}>{/* TODO: Menu button */}</View>
      </View>
      <View style={styles.content}>
        <Text style={styles.contentText}>{post.content}</Text>
      </View>

      {/* Show reply button when not a comment and not already showing reply field */}
      {!comment && !reply && (
        <TouchableOpacity onPress={() => setReply(true)}>
          <View style={styles.replyButton}>
            <Icon
              name="corner-down-right-outline"
              style={styles.replyButtonIcon}
            />
            <Text style={styles.replyButtonText}>Reply</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Render post children */}
      {!comment && (
        <View style={styles.children}>
          {(post.childrenPosts || []).map((post) => (
            <Post key={post.id} post={post} comment />
          ))}

          {/* Reply field */}
          {reply && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {user.avatarThumbnailUrl ? (
                <Image
                  source={{ uri: user.avatarThumbnailUrl }}
                  style={{ width: 32, height: 32 }}
                  resizeMode="contain"
                />
              ) : (
                <UnknownAvatarDesign size={32} />
              )}
              <Input style={{ flexGrow: 1, marginLeft: 8 }} />
              <Button
                style={[styles.iconButton, styles.sendButton]}
                accessoryLeft={SendIcon}
              />
            </View>
          )}
        </View>
      )}
    </View>
  )
}

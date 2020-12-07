import React, { useCallback, useMemo, useState } from 'react'
import styles from './styles'
import { View, Image, ToastAndroid } from 'react-native'
import { Button, Icon, Input, Text } from '@ui-kitten/components'
import gql from 'graphql-tag'
import {
  PostQuery,
  PostFragment,
  ReplyPostMutation,
  ReplyPostMutationVariables,
} from 'types/apollo-schema-types'
import { UnknownAvatarDesign } from 'components/UnknownAvatarDesign'
import dayjs from 'dayjs'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'
import { useMutation, useQuery } from '@apollo/client'

const SendIcon = (props: any) => <Icon {...props} name="paper-plane" />
const formatPostDate = (date: Date): string => (dayjs(date) as any).fromNow()

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
}
export const Post = React.memo(({ post }: PostProps) => {
  const { user } = post

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const navigateToUser = useCallback(() => {
    navigation.navigate('UserScreen', { userId: post.user.id })
  }, [post.user.id, navigation])

  const postQuery = useQuery<PostQuery>(
    gql`
      query PostQuery {
        me {
          id
          avatarThumbnailUrl
        }
      }
    `,
    { partialRefetch: true, fetchPolicy: 'cache-only' }
  )

  // Show reply field when there's already children
  const [showReply, setShowReply] = useState(
    (post.childrenPosts?.length || 0) > 0
  )

  // Order replies
  const childrenPosts = useMemo(() => {
    const posts = [...(post.childrenPosts || [])]
    posts.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    return posts
  }, [post.childrenPosts])

  // Reply
  const [sendMessage, sendMessageRes] = useMutation<
    ReplyPostMutation,
    ReplyPostMutationVariables
  >(
    gql`
      mutation ReplyPostMutation($parentPostId: ID!, $content: String!) {
        createPost(parentPostId: $parentPostId, content: $content) {
          id
        }
      }
    `
  )

  const [replyText, setReplyText] = useState('')
  const sendDisabled = replyText.length === 0
  const onReply = useCallback(async () => {
    setReplyText('')
    try {
      await sendMessage({
        variables: {
          content: replyText,
          parentPostId: post.id,
        },
      })
    } catch (error) {
      ToastAndroid.show('Error sending message', ToastAndroid.SHORT)
      // Restore the text the user was typing on error so they can send again
      setReplyText(replyText)
    }
  }, [post, replyText, sendMessage])

  return (
    <View style={styles.post}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateToUser}>
          {user.avatarThumbnailUrl ? (
            <Image
              source={{ uri: user.avatarThumbnailUrl }}
              style={{ width: 72, height: 72 }}
              resizeMode="contain"
            />
          ) : (
            <UnknownAvatarDesign size={72} />
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
              {formatPostDate(post.createdAt)}
            </Text>
            {post.updatedAt !== post.createdAt ? (
              <Text style={styles.updatedAtText}>
                {' '}
                {formatPostDate(post.updatedAt)}
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

      {/* Show reply button when not already showing reply field */}
      {!showReply && (
        <TouchableOpacity onPress={() => setShowReply(true)}>
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
      <View style={styles.children}>
        {childrenPosts.map((post) => (
          <Comment key={post.id} comment={post} />
        ))}

        {/* Reply field */}
        {showReply && (
          <View style={styles.reply}>
            <View style={styles.replyAvatar}>
              {postQuery.data?.me.avatarThumbnailUrl ? (
                <Image
                  source={{ uri: postQuery.data.me.avatarThumbnailUrl }}
                  style={{ width: 32, height: 32 }}
                  resizeMode="contain"
                />
              ) : (
                <UnknownAvatarDesign size={32} />
              )}
            </View>
            <Input
              style={styles.replyInput}
              multiline
              placeholder="Comment"
              value={replyText}
              onChangeText={setReplyText}
            />
            <Button
              style={[styles.iconButton, styles.replySendButton]}
              accessoryLeft={SendIcon}
              disabled={sendMessageRes.loading || sendDisabled}
              onPress={onReply}
            />
          </View>
        )}
      </View>
    </View>
  )
})
Post.displayName = 'Post'

export type CommentProps = {
  comment: PostFragment
}
/**
 * A single comment under a post
 */
export const Comment = React.memo(({ comment }: CommentProps) => {
  const { user } = comment
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  const navigateToUser = useCallback(() => {
    navigation.navigate('UserScreen', { userId: comment.user.id })
  }, [comment.user.id, navigation])

  return (
    <View style={styles.comment}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateToUser}>
          {user.avatarThumbnailUrl ? (
            <Image
              source={{ uri: user.avatarThumbnailUrl }}
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
          ) : (
            <UnknownAvatarDesign size={50} />
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
              {formatPostDate(comment.createdAt)}
            </Text>
            {comment.updatedAt !== comment.createdAt ? (
              <Text style={styles.updatedAtText}>
                {' '}
                Edited {formatPostDate(comment.updatedAt)}
              </Text>
            ) : (
              ''
            )}
          </Text>
        </View>
        <View style={styles.headerMore}>{/* TODO: Menu button */}</View>
      </View>
      <View style={styles.content}>
        <Text style={styles.contentText} selectable>
          {comment.content}
        </Text>
      </View>
    </View>
  )
})
Comment.displayName = 'Comment'

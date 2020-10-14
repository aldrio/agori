import React from 'react'
import styles from './styles'
import { View, Image } from 'react-native'
import { Text } from '@ui-kitten/components'
import gql from 'graphql-tag'
import { PostFragment } from 'types/apollo-schema-types'
import { UnknownAvatarDesign } from 'components/UnknownAvatarDesign'
import dayjs from 'dayjs'

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
export const Post: React.FC<PostProps> = ({ post }) => {
  const { user } = post
  return (
    <View style={styles.post}>
      <View style={styles.header}>
        {user.avatarThumbnailUrl ? (
          <Image
            source={{ uri: user.avatarThumbnailUrl }}
            style={{ width: 50, height: 50 }}
            resizeMode="contain"
          />
        ) : (
          <UnknownAvatarDesign size={50} />
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.displayNameText}>{user.displayName}</Text>
          <Text>
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
      </View>
      <View style={styles.content}>
        <Text style={styles.contentText}>{post.content}</Text>
      </View>
      <View style={styles.children}>
        {(post.childrenPosts || []).map((post) => (
          <Post post={post} />
        ))}
      </View>
    </View>
  )
}

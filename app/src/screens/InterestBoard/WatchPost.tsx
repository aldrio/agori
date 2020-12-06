import React, { useEffect } from 'react'
import { Post, PostGqlFragment, PostProps } from 'components/Post'
import { SubscribeToMoreOptions } from 'apollo-client'
import {
  InterestBoardQuery,
  PostChildAddedSubscription,
  PostChildAddedSubscriptionVariables,
} from 'types/apollo-schema-types'
import gql from 'graphql-tag'
import rfdc from 'rfdc'
const clone = rfdc()

export type WatchPostProps = PostProps & {
  subscribeToMore: (
    options: SubscribeToMoreOptions<
      InterestBoardQuery,
      PostChildAddedSubscriptionVariables,
      PostChildAddedSubscription
    >
  ) => () => void
}

/**
 * Wraps `Post` component to subscribe to realtime updates
 */
export const WatchPost = ({ subscribeToMore, ...props }: WatchPostProps) => {
  const postId = props.post.id

  // Subscribe to updates of this post while it's mounted
  useEffect(() => {
    return subscribeToMore({
      document: gql`
        subscription PostChildAddedSubscription($postId: ID!) {
          watchPostChildAdded(postId: $postId) {
            id
            ...PostFragment
          }
        }
        ${PostGqlFragment}
      `,
      variables: {
        postId,
      },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: { watchPostChildAdded: child },
          },
        }
      ) => {
        // Insert new post into InterestBoard data
        const data = clone(prev)
        const post = data.interest.posts.find((p) => p.id === postId)

        if (!post) {
          return prev
        }

        post.childrenPosts.push(child)

        return data
      },
    })
  }, [postId, subscribeToMore])

  return <Post {...props} />
}

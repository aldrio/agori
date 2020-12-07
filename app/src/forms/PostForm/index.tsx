import React, { useState } from 'react'
import styles from './styles'
import { ToastAndroid, View } from 'react-native'
import { Input, Button, TopNavigationAction, Icon } from '@ui-kitten/components'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import {
  PostFormFragment,
  SavePostMutation,
  SavePostMutationVariables,
} from 'types/apollo-schema-types'
import { BlackPortal } from 'react-native-portal'
import { MakePostScreenName } from 'screens/MakePost'

export const PostFormGqlFragment = gql`
  fragment PostFormFragment on Post {
    id
  }
`

const SaveIcon = (props: any) => <Icon {...props} name="save" />

export type PostFormProps = {
  interestId: string
  onCompleted?: (post: PostFormFragment) => void
}
/**
 * Page for
 */
export const PostForm: React.FC<PostFormProps> = ({
  interestId,
  onCompleted,
}) => {
  const [postInput, setPostInput] = useState('')

  const [savePostInner, { loading }] = useMutation<
    SavePostMutation,
    SavePostMutationVariables
  >(
    gql`
      mutation SavePostMutation($interestId: ID!, $content: String!) {
        createPost(interestId: $interestId, content: $content) {
          id
          ...PostFormFragment
        }
      }
      ${PostFormGqlFragment}
    `,
    {
      onCompleted: (data) => onCompleted && onCompleted(data.createPost),
      onError: (error) => ToastAndroid.show(error.message, ToastAndroid.SHORT),
      update: (cache, { data }) => {
        if (!data) {
          return
        }

        const { createPost: post } = data

        // Add post to cached list of interest posts
        cache.modify({
          id: cache.identify({
            __typename: 'Interest',
            id: interestId,
          }),
          fields: {
            posts: (existingPostsRefs = [], { readField }) => {
              const newPostRef = cache.writeFragment({
                data: post,
                fragment: PostFormGqlFragment,
              })

              // Don't add it if it's already cached
              if (
                existingPostsRefs.some(
                  (ref: any) => readField('id', ref) === post.id
                )
              ) {
                return existingPostsRefs
              }

              return [...existingPostsRefs, newPostRef]
            },
          },
        })
      },
    }
  )
  const savePost = () => {
    savePostInner({
      variables: {
        interestId,
        content: postInput,
      },
    })
  }

  const disabled = loading

  return (
    <View style={styles.postForm}>
      <BlackPortal name={MakePostScreenName}>
        <TopNavigationAction icon={SaveIcon} onPress={savePost} />
      </BlackPortal>

      <Input
        multiline
        placeholder="Your post"
        textStyle={{ minHeight: 128, textAlignVertical: 'top' }}
        value={postInput}
        onChangeText={setPostInput}
        disabled={disabled}
      />
      <Button onPress={savePost} disabled={disabled}>
        Post
      </Button>
    </View>
  )
}

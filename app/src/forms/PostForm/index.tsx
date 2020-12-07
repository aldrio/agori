import React, { useState } from 'react'
import styles from './styles'
import { ToastAndroid, View } from 'react-native'
import { Input, Button, TopNavigationAction, Icon } from '@ui-kitten/components'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import {
  SavePostMutation,
  SavePostMutationVariables,
} from 'types/apollo-schema-types'
import { BlackPortal } from 'react-native-portal'
import { MakePostScreenName } from 'screens/MakePost'

const SaveIcon = (props: any) => <Icon {...props} name="save" />

export type PostFormProps = {
  interestId: string
  onCompleted?: (postId: string) => void
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
        }
      }
    `,
    {
      onCompleted: (data) => onCompleted && onCompleted(data.createPost.id),
      onError: (error) => ToastAndroid.show(error.message, ToastAndroid.SHORT),
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

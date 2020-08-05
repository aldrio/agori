import React, { useState, useEffect, useRef } from 'react'
import styles from './styles'
import { View } from 'react-native'
import {
  Input,
  Button,
  Spinner,
} from '@ui-kitten/components'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import {
  EditProfileMutation,
  EditProfileMutationVariables,
  ProfileFormFragment,
} from 'types/apollo-schema-types'
import { FormItem } from 'components/FormItem'
import { BlackPortal } from 'react-native-portal'
import { EditProfileScreenName } from 'screens/EditProfile'
import { TopNavigationSaveButton } from 'components/TopNavigationSaveButton'

export const ProfileFormGqlFragment = gql`
  fragment ProfileFormFragment on User {
    id
    displayName
    bio
  }
`

export type ProfileFormProps = {
  profile: ProfileFormFragment
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile }) => {
  const [editProfile, { loading }] = useMutation<
    EditProfileMutation,
    EditProfileMutationVariables
  >(
    gql`
      mutation EditProfileMutation($displayName: String, $bio: String) {
        editMe(editUser: { displayName: $displayName, bio: $bio }) {
          id
          ...ProfileFormFragment
        }
      }
      ${ProfileFormGqlFragment}
    `
  )

  const [displayName, setDisplayName] = useState(profile.displayName)
  const [displayNameError, setDisplayNameError] = useState<string | null>(null)
  const displayNameInputRef = useRef<Input>(null)

  const [bio, setBio] = useState(profile.bio || '')
  const [bioError, setBioError] = useState<string | null>(null)
  const bioInputRef = useRef<Input>(null)

  const submit = () => {
    let errors = false

    // Validate form inputs
    if (displayName.trim().length === 0) {
      errors = true
      setDisplayNameError('Display Name is required')
    }

    if (!errors) {
      setDisplayNameError(null)
      setBioError(null)

      editProfile({ variables: { displayName, bio: bio || null } })
    }
  }

  const [size, setSize] = useState(100)

  return (
    <View style={styles.profileForm}>
      {/* TODO: Put profile picture */}
      <FormItem>
        <Input
          disabled={loading}
          ref={displayNameInputRef}
          label="Display Name"
          placeholder="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
          size="large"
          returnKeyType="next"
          onSubmitEditing={() => bioInputRef.current!.focus()}
          caption={displayNameError || undefined}
          status={displayNameError ? 'danger' : undefined}
        />
      </FormItem>
      <FormItem>
        <Input
          disabled={loading}
          ref={bioInputRef}
          label="Bio"
          placeholder="A little about myself..."
          multiline
          numberOfLines={6}
          maxLength={1000}
          value={bio}
          onChangeText={setBio}
          textAlignVertical="top"
          onContentSizeChange={(e) => setSize(e.nativeEvent.contentSize.height)}
          caption={bioError || undefined}
          status={bioError ? 'danger' : undefined}
        />
      </FormItem>
      <Button
        onPress={submit}
        disabled={loading}
        accessoryLeft={
          loading
            ? (props) => (
                <View {...props}>
                  <Spinner size="small" status="basic" />
                </View>
              )
            : undefined
        }
      >
        Save
      </Button>
      {/* Show header save button on edit profile screen */}
      <BlackPortal name={EditProfileScreenName}>
        <TopNavigationSaveButton
          loading={loading}
          onPress={submit}
        />
      </BlackPortal>
    </View>
  )
}

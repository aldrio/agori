import React, { useState, useRef } from 'react'
import styles from './styles'
import { View, ToastAndroid, Image } from 'react-native'
import { Input, Text, Icon } from '@ui-kitten/components'
import { useMutation } from '@apollo/client'
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
import { UnknownAvatarDesign } from 'components/UnknownAvatarDesign'
import { Section } from 'components/Section'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'
import { Chip } from 'components/Chip'

export const ProfileFormGqlFragment = gql`
  fragment ProfileFormFragment on User {
    id
    avatarData
    avatarThumbnailUrl
    displayName
    bio
    interests {
      id
      label
    }
  }
`

export type ProfileFormProps = {
  profile: ProfileFormFragment
  onCompleted?: (profile: ProfileFormFragment) => void
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onCompleted,
}) => {
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
    `,
    {
      onCompleted: (data) => onCompleted && onCompleted(data.editMe),
      onError: (error) => ToastAndroid.show(error.message, ToastAndroid.SHORT),
    }
  )

  const [displayName, setDisplayName] = useState(profile.displayName)
  const [displayNameError, setDisplayNameError] = useState<string | null>(null)
  const displayNameInputRef = useRef<Input>(null)

  const [bio, setBio] = useState(profile.bio || '')
  const [bioError, setBioError] = useState<string | null>(null)
  const bioInputRef = useRef<Input>(null)

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

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

  const navigateAvatarScreen = () => navigation.navigate('AvatarScreen', {})
  const navigateInterestsScreen = () =>
    navigation.navigate('InterestsScreen', {})

  return (
    <View style={styles.profileForm}>
      <Section title="Avatar">
        <TouchableOpacity onPress={navigateAvatarScreen}>
          <View style={styles.editAvatarButton}>
            {profile.avatarThumbnailUrl ? (
              <Image
                source={{ uri: profile.avatarThumbnailUrl }}
                style={{ width: 140, height: 140 }}
                resizeMode="contain"
              />
            ) : (
              <UnknownAvatarDesign size={140} />
            )}
            <Icon
              name="edit-outline"
              fill="#8F9BB3"
              style={styles.editAvatarIcon}
            />
          </View>
        </TouchableOpacity>
      </Section>
      <Section title="Profile">
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
            caption={bioError || undefined}
            status={bioError ? 'danger' : undefined}
          />
        </FormItem>
      </Section>
      <Section title="Interests" topDivider={false} bottomDivider={false}>
        <TouchableOpacity onPress={navigateInterestsScreen}>
          <View style={styles.interestContainer}>
            {profile.interests.length === 0 ? (
              <>
                <Text appearance="hint">Add some interests!</Text>
                <Icon
                  name="plus-square-outline"
                  fill="#8F9BB3"
                  style={styles.addInterestsIcon}
                />
              </>
            ) : (
              <>
                <View style={styles.interestList}>
                  {profile.interests.map((interest) => (
                    <Chip
                      key={interest.id}
                      label={interest.label}
                      active={true}
                    />
                  ))}
                </View>
                <Icon
                  name="edit-outline"
                  fill="#8F9BB3"
                  style={styles.addInterestsIcon}
                />
              </>
            )}
          </View>
        </TouchableOpacity>
      </Section>
      {/* Show header save button on edit profile screen */}
      <BlackPortal name={EditProfileScreenName}>
        <TopNavigationSaveButton loading={loading} onPress={submit} />
      </BlackPortal>
    </View>
  )
}

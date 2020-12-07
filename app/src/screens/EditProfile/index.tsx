import React from 'react'
import styles from './styles'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Screen } from 'components/Screen'
import { ProfileForm, ProfileFormGqlFragment } from 'forms/ProfileForm'
import { useQuery } from '@apollo/client'
import { ProfileQuery } from 'types/apollo-schema-types'
import gql from 'graphql-tag'

export const EditProfileScreenName = 'EditProfileScreen'
export type EditProfileScreenParams = {}
type EditProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof EditProfileScreenName
>
type EditProfileScreenRouteProp = RouteProp<
  RootStackParamList,
  typeof EditProfileScreenName
>

export type EditProfileProps = {
  navigation: EditProfileScreenNavigationProp
  route: EditProfileScreenRouteProp
}
export const EditProfileScreen: React.FC<EditProfileProps> = ({
  navigation,
}) => {
  const { data, loading, error, refetch } = useQuery<ProfileQuery>(
    gql`
      query ProfileQuery {
        me {
          id
          ...ProfileFormFragment
        }
      }
      ${ProfileFormGqlFragment}
    `,
    { partialRefetch: true, fetchPolicy: 'network-only' }
  )

  let body
  if (data) {
    const onCompleted = () => navigation.goBack()
    body = <ProfileForm profile={data.me} onCompleted={onCompleted} />
  }

  return (
    <Screen
      title="Edit Profile"
      close
      onRefresh={refetch}
      loading={loading}
      error={error?.message}
      optionsKey={EditProfileScreenName}
    >
      {body}
    </Screen>
  )
}

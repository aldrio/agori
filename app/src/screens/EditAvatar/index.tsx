import React from 'react'
import styles from './styles'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Screen } from 'components/Screen'
import { AvatarFormGqlFragment, AvatarForm } from 'forms/AvatarForm'
import { useQuery } from '@apollo/react-hooks'
import { AvatarQuery } from 'types/apollo-schema-types'
import gql from 'graphql-tag'

export const EditAvatarScreenName = 'AvatarScreen'
export type EditAvatarScreenParams = {}
type EditAvatarScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof EditAvatarScreenName
>
type EditAvatarScreenRouteProp = RouteProp<
  RootStackParamList,
  typeof EditAvatarScreenName
>

export type EditAvatarProps = {
  navigation: EditAvatarScreenNavigationProp
  route: EditAvatarScreenRouteProp
}

export const EditAvatarScreen: React.FC<EditAvatarProps> = ({ navigation }) => {
  const { data, loading, error } = useQuery<AvatarQuery>(
    gql`
      query AvatarQuery {
        me {
          id
          ...AvatarFormFragment
        }
      }
      ${AvatarFormGqlFragment}
    `,
    { partialRefetch: true, fetchPolicy: 'network-only' }
  )

  let body
  if (data) {
    const onCompleted = () => navigation.goBack()
    body = <AvatarForm data={data.me} onCompleted={onCompleted} />
  }

  return (
    <Screen
      title="Edit Avatar"
      close
      loading={loading}
      error={error?.message}
      optionsKey={EditAvatarScreenName}
      noScroll
      padding={false}
    >
      {body}
    </Screen>
  )
}

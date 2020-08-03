import React from 'react'
import styles from './styles'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Screen } from 'components/Screen'
import { Text, Button, Divider } from '@ui-kitten/components'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { UserQuery, UserQueryVariables } from 'types/apollo-schema-types'
import { Chip } from 'components/Chip'
import { Alert, View } from 'react-native'

export const UserScreenName = 'UserScreen'
export type UserScreenParams = {
  userId: string
}
type UserScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof UserScreenName
>
type UserScreenRouteProp = RouteProp<RootStackParamList, typeof UserScreenName>

export type ProfileProps = {
  navigation: UserScreenNavigationProp
  route: UserScreenRouteProp
}
export const UserScreen: React.FC<ProfileProps> = ({ navigation, route }) => {
  const { data, loading, error, refetch } = useQuery<
    UserQuery,
    UserQueryVariables
  >(
    gql`
      query UserQuery($userId: ID!) {
        user(id: $userId) {
          id
          displayName
          interests {
            id
            label
            description
          }
        }
        me {
          id
          interests {
            id
          }
        }
      }
    `,
    { variables: { userId: route.params.userId } }
  )

  let body = null
  if (data) {
    const { user } = data
    body = (
      <>
        <Text category="h3">{user.displayName}</Text>
        <Text>{JSON.stringify(data.user)}</Text>
        <Button
          onPress={() => {
            navigation.navigate('ChatScreen', { userId: user.id })
          }}
        >
          Chat
        </Button>

        <Divider />
        <View>
          <Text category="h6">Interests</Text>
          <View style={styles.interestList}>
            {user.interests.map((interest) => {
              const isMatch = !!data.me.interests.find(
                (mi) => mi.id === interest.id
              )

              return (
                <Chip
                  label={interest.label}
                  onLongPress={() =>
                    Alert.alert(interest.description || 'No description')
                  }
                  active={isMatch}
                />
              )
            })}
          </View>
          <Divider />
        </View>
      </>
    )
  }

  return (
    <Screen
      title={data?.user.displayName || 'User'}
      back
      onRefresh={refetch}
      loading={loading}
      error={error?.message}
    >
      {body}
    </Screen>
  )
}

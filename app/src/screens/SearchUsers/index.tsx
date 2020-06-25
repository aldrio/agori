import React, { useState } from 'react'
import styles from './styles'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Screen } from 'components/Screen'
import { Text, Button } from '@ui-kitten/components'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { SearchUsersQuery } from 'types/apollo-schema-types'

export const SearchUsersScreenName = 'SearchUsersScreen'
export type SearchUsersScreenParams = {}
type SearchUsersScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof SearchUsersScreenName
>
type SearchUsersScreenRouteProp = RouteProp<
  RootStackParamList,
  typeof SearchUsersScreenName
>

export type SearchUsersProps = {
  navigation: SearchUsersScreenNavigationProp
  route: SearchUsersScreenRouteProp
}
export const SearchUsersScreen: React.FC<SearchUsersProps> = ({
  navigation,
  route,
}) => {
  const { data, loading, error, refetch } = useQuery<SearchUsersQuery>(gql`
    query SearchUsersQuery {
      me {
        id
        displayName
      }
      users {
        id
        displayName
      }
    }
  `)

  let body = null
  if (data) {
    body = (
      <>
        <Text>{data.me.displayName}</Text>
        {data.users.map((user) => (
          <Button
            key={user.id}
            onPress={() => {
              navigation.navigate('UserScreen', { userId: user.id })
            }}
          >
            {user.displayName}
          </Button>
        ))}
      </>
    )
  }

  return (
    <Screen
      title="SearchUsers"
      back
      onRefresh={refetch}
      loading={loading}
      error={error?.message}
    >
      {body}
    </Screen>
  )
}

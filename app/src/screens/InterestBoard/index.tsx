import React from 'react'
import styles from './styles'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Screen } from 'components/Screen'
import { Text } from '@ui-kitten/components'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import {
  InterestBoardQuery,
  InterestBoardQueryVariables,
} from 'types/apollo-schema-types'
import { View } from 'react-native'
import { Post, PostGqlFragment } from 'components/Post'

export const InterestBoardScreenName = 'InterestBoardScreen'
export type InterestBoardScreenParams = {
  interestId: string
}
type InterestBoardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof InterestBoardScreenName
>
type InterestBoardScreenRouteProp = RouteProp<
  RootStackParamList,
  typeof InterestBoardScreenName
>

export type InterestBoardProps = {
  navigation: InterestBoardScreenNavigationProp
  route: InterestBoardScreenRouteProp
}
export const InterestBoardScreen: React.FC<InterestBoardProps> = ({
  navigation,
  route,
}) => {
  const { interestId } = route.params
  const { data, loading, error, refetch } = useQuery<
    InterestBoardQuery,
    InterestBoardQueryVariables
  >(
    gql`
      query InterestBoardQuery($interestId: ID!) {
        interest(id: $interestId) {
          id
          label
          description
          posts(query: {}) {
            id
            ...PostFragment
            childrenPosts(query: {}) {
              id
              ...PostFragment
              childrenPosts(query: {}) {
                id
                ...PostFragment
              }
            }
          }
        }
      }
      ${PostGqlFragment}
    `,
    { variables: { interestId } }
  )

  let body = null
  if (data) {
    const { interest } = data
    body = (
      <View>
        <Text>{interest.description}</Text>
        <Text>{interest.posts.length} posts</Text>

        {interest.posts.map((post) => (
          <Post post={post} />
        ))}
      </View>
    )
  }

  return (
    <Screen
      title={data?.interest.label || 'Interest'}
      back
      onRefresh={refetch}
      loading={loading}
      error={error?.message}
    >
      {body}
    </Screen>
  )
}

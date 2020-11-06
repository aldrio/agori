import React from 'react'
import styles from './styles'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Screen } from 'components/Screen'
import { InterestsQuery } from 'types/apollo-schema-types'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { InterestToggleGqlFragment, InterestToggle } from 'forms/InterestToggle'
import { View } from 'react-native'

export const InterestsScreenName = 'InterestsScreen'
export type InterestsScreenParams = {}
type InterestsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof InterestsScreenName
>
type InterestsScreenRouteProp = RouteProp<
  RootStackParamList,
  typeof InterestsScreenName
>

export type InterestsProps = {
  navigation: InterestsScreenNavigationProp
  route: InterestsScreenRouteProp
}
export const InterestsScreen: React.FC<InterestsProps> = () => {
  const { data, loading, error, refetch } = useQuery<InterestsQuery>(
    gql`
      query InterestsQuery {
        me {
          id
          interests {
            id
          }
        }
        interests {
          id
          ...InterestToggleFragment
        }
      }
      ${InterestToggleGqlFragment}
    `,
    { partialRefetch: false }
  )

  return (
    <Screen
      title="Interests"
      back
      onRefresh={refetch}
      loading={loading}
      error={error?.message}
    >
      <View style={styles.interests}>
        {data?.interests.map((interest) => (
          <InterestToggle interest={interest} key={interest.id} />
        ))}
      </View>
    </Screen>
  )
}

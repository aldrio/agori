import React, { useCallback } from 'react'
import styles from './styles'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Screen } from 'components/Screen'
import { Icon, Text, TopNavigationAction } from '@ui-kitten/components'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import {
  InterestBoardQuery,
  InterestBoardQueryVariables,
  InterestBoardQuery_interest_posts,
} from 'types/apollo-schema-types'
import { FlatList, ListRenderItem, RefreshControl } from 'react-native'
import { PostGqlFragment } from 'components/Post'
import { WatchPost } from './WatchPost'
import { BlackPortal } from 'react-native-portal'

const AddIcon = (props: any) => <Icon {...props} name="plus-square-outline" />

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
  route,
  navigation,
}) => {
  const { interestId } = route.params

  const navigateToMakePost = useCallback(() => {
    navigation.navigate('MakePostScreen', {
      interestId,
    })
  }, [navigation, interestId])

  const { data, loading, error, refetch, subscribeToMore } = useQuery<
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
            }
          }
        }
      }
      ${PostGqlFragment}
    `,
    { variables: { interestId } }
  )

  const extractKey = useCallback(
    (post: InterestBoardQuery_interest_posts) => post.id,
    []
  )
  const renderPost = useCallback<
    ListRenderItem<InterestBoardQuery_interest_posts>
  >(
    ({ item: post }) => {
      // Wrap mounted posts in `WatchPost` so it can subscribe to more info
      return <WatchPost subscribeToMore={subscribeToMore} post={post} />
    },
    [subscribeToMore]
  )

  let body = null
  if (data) {
    const { interest } = data

    body = (
      <FlatList
        refreshControl={
          <RefreshControl refreshing={loading === true} onRefresh={refetch} />
        }
        ListHeaderComponent={
          <>
            <Text>{interest.description}</Text>
            <Text>{interest.posts.length} posts</Text>
          </>
        }
        data={interest.posts}
        keyExtractor={extractKey}
        renderItem={renderPost}
        contentContainerStyle={styles.list}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="always"
        initialNumToRender={5}
      />
    )
  }

  return (
    <Screen
      title={data?.interest.label || 'Interest'}
      back
      onRefresh={refetch}
      loading={loading}
      error={error?.message}
      noScroll={!!data}
      padding={!data}
      optionsKey={InterestBoardScreenName}
    >
      <BlackPortal name={InterestBoardScreenName}>
        <TopNavigationAction icon={AddIcon} onPress={navigateToMakePost} />
      </BlackPortal>
      {body}
    </Screen>
  )
}

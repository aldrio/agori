import React from 'react'
import styles from './styles'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Screen } from 'components/Screen'
import { Text, Divider } from '@ui-kitten/components'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { SearchUsersQuery } from 'types/apollo-schema-types'
import {
  FlatList,
  TouchableOpacity,
  Image,
  View,
  useWindowDimensions,
  PixelRatio,
} from 'react-native'
import { UnknownAvatarDesign } from 'components/UnknownAvatarDesign'

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
  const { data, loading, error, refetch } = useQuery<SearchUsersQuery>(
    gql`
      query SearchUsersQuery {
        searchUsers {
          user {
            id
            displayName
            avatarThumbnailUrl
          }
          interestsInCommon
        }
      }
    `,
    {
      fetchPolicy: 'network-only',
    }
  )

  const { width: windowWidth } = useWindowDimensions()

  let body = null
  if (data) {
    const results = data.searchUsers

    // 3 columns on bigger screens, 2 on smaller
    const columns = windowWidth > 400 ? 3 : 2

    body = (
      <FlatList
        numColumns={columns}
        data={results}
        contentContainerStyle={styles.innerList}
        columnWrapperStyle={styles.listColumnWrapper}
        renderItem={({ item: { user, interestsInCommon } }) => (
          <View
            style={{
              flex: 1 / columns,
              flexGrow: 1 / columns,
              flexShrink: 1 / columns,
              padding: 4,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('UserScreen', { userId: user.id })
              }
              style={{ flex: 1 }}
            >
              <View style={styles.item}>
                {user.avatarThumbnailUrl ? (
                  <Image
                    source={{ uri: user.avatarThumbnailUrl }}
                    resizeMode="contain"
                    style={{ aspectRatio: 1, width: '100%' }}
                  />
                ) : (
                  <UnknownAvatarDesign size="100%" />
                )}
                <Divider style={{ alignSelf: 'stretch', marginVertical: 12 }} />
                <View style={styles.userInfo}>
                  <Text>{user.displayName}</Text>
                  <Text>{interestsInCommon} matches</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(result) => result.user.id}
      />
    )
  }

  return (
    <Screen
      title="Search"
      // Dont allow refetch when there is data
      onRefresh={data ? refetch : refetch}
      noScroll={!!data}
      padding={!data}
      loading={loading}
      error={error?.message}
    >
      {body}
    </Screen>
  )
}

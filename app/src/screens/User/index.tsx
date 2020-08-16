import React, { useMemo } from 'react'
import styles from './styles'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Screen } from 'components/Screen'
import { Text, Button, useTheme } from '@ui-kitten/components'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import {
  UserQuery,
  UserQueryVariables,
  CurrentUserScreenQuery,
} from 'types/apollo-schema-types'
import { Chip } from 'components/Chip'
import { Alert, View, useWindowDimensions } from 'react-native'
import { AvatarDesign } from 'components/AvatarDesign'
import { AvatarDesignData } from 'components/AvatarDesign/pieces'
import { Section } from 'components/Section'
import { BlackPortal } from 'react-native-portal'
import { TopNavigationEditButton } from 'components/TopNavigationEditButton'
import { PersonalNote } from 'components/PersonalNote'
import { UnknownAvatarDesign } from 'components/UnknownAvatarDesign'

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
  userId?: string
}
export const UserScreen: React.FC<ProfileProps> = ({
  navigation,
  route,
  userId,
}) => {
  const { data, loading, error, refetch } = useQuery<
    UserQuery,
    UserQueryVariables
  >(
    gql`
      query UserQuery($userId: ID!) {
        user(id: $userId) {
          id
          displayName
          avatarData
          bio
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
    { variables: { userId: userId || route.params.userId } }
  )

  const avatarDesign = useMemo<AvatarDesignData | null>(() => {
    if (data?.user.avatarData) {
      return JSON.parse(data.user.avatarData) as AvatarDesignData
    } else {
      return null
    }
  }, [data?.user.avatarData])

  const theme = useTheme()
  const { width, height } = useWindowDimensions()

  let body = null
  if (data) {
    const isOwnProfile = data.me.id === data.user.id
    const { user } = data
    const size = Math.min(height - 500, width * 0.5)

    body = (
      <>
        {isOwnProfile && (
          <BlackPortal name={UserScreenName}>
            <TopNavigationEditButton
              onPress={() => navigation.navigate('EditProfileScreen', {})}
            />
          </BlackPortal>
        )}
        <View
          style={[
            styles.header,
            { backgroundColor: theme['color-primary-100'] },
          ]}
        >
          {avatarDesign ? (
            <AvatarDesign
              size={size}
              design={avatarDesign}
              avatarStyle="Circle"
            />
          ) : (
            <UnknownAvatarDesign size={size} />
          )}
        </View>
        <Button
          disabled={isOwnProfile}
          onPress={() => {
            navigation.navigate('ChatScreen', { userId: user.id })
          }}
        >
          Chat
        </Button>

        <Section title={`About ${user.displayName}`} topDivider={false}>
          {user.bio ? (
            <Text>{user.bio}</Text>
          ) : (
            <Text appearance="hint">
              {user.displayName} hasn't written about themselves...
            </Text>
          )}
        </Section>

        <Section title="Interests" topDivider={false}>
          <View style={styles.interestList}>
            {user.interests.map((interest) => {
              const isMatch = !!data.me.interests.find(
                (mi) => mi.id === interest.id
              )

              return (
                <Chip
                  key={interest.id}
                  label={interest.label}
                  onLongPress={() =>
                    Alert.alert(interest.description || 'No description')
                  }
                  active={isMatch}
                />
              )
            })}
          </View>
        </Section>

        <Section title="Note">
          <PersonalNote id={user.id} />
          <Text appearance="hint" category="c1">
            Keep a simple reminder. Only you can see this.
          </Text>
        </Section>
      </>
    )
  }

  return (
    <Screen
      title={data?.user.displayName || 'User'}
      back={!userId}
      onRefresh={refetch}
      loading={loading}
      error={error?.message}
      optionsKey={UserScreenName}
    >
      {body}
    </Screen>
  )
}

export const CurrentUserScreenName = 'CurrentUserScreen'
export type CurrentUserScreenParams = {}
type CurrentUserScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof CurrentUserScreenName
>
type CurrentUserScreenRouteProp = RouteProp<
  RootStackParamList,
  typeof CurrentUserScreenName
>

export type CurrentUserProps = {
  navigation: CurrentUserScreenNavigationProp
  route: CurrentUserScreenRouteProp
}
export const CurrentUserScreen: React.FC<CurrentUserProps> = ({
  navigation,
  route,
}) => {
  const { data, error, loading } = useQuery<CurrentUserScreenQuery>(
    gql`
      query CurrentUserScreenQuery {
        me {
          id
        }
      }
    `
  )

  if (!data) {
    return null
  }

  return (
    <UserScreen
      navigation={navigation as any}
      route={route as any}
      userId={data.me.id}
    />
  )
}

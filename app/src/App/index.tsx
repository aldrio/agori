import React from 'react'
import { useObserver } from 'mobx-react-lite'
import auth from 'utils/auth'

import { ApolloProvider } from '@apollo/react-hooks'

import { ApplicationProvider, IconRegistry, Text } from '@ui-kitten/components'
import * as eva from '@eva-design/eva'
import { agoriTheme } from 'utils/theme'
import { EvaIconsPack } from '@ui-kitten/eva-icons'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  PlaceholderScreenName,
  PlaceholderScreen,
  PlaceholderScreenParams,
} from 'screens/Placeholder'
import { AuthScreenName, AuthScreenParams, AuthScreen } from 'screens/Auth'
import { MainScreenName, MainScreenParams, MainScreen } from 'screens/Main'
import {
  SearchUsersScreenName,
  SearchUsersScreenParams,
  SearchUsersScreen,
} from 'screens/SearchUsers'
import apolloClient from 'utils/apollo-client'
import {
  UserScreenName,
  UserScreenParams,
  UserScreen,
  CurrentUserScreenName,
  CurrentUserScreenParams,
  CurrentUserScreen,
} from 'screens/User'
import { ChatScreenName, ChatScreenParams, ChatScreen } from 'screens/Chat'
import {
  InterestsScreenName,
  InterestsScreenParams,
  InterestsScreen,
} from 'screens/Interests'
import {
  EditAvatarScreenName,
  EditAvatarScreenParams,
  EditAvatarScreen,
} from 'screens/EditAvatar'
import {
  EditProfileScreenName,
  EditProfileScreenParams,
  EditProfileScreen,
} from 'screens/EditProfile'
import { PortalProvider } from 'react-native-portal'
import { MainTabs as MainTabsComponent } from 'components/MainTabs'

export type RootStackParamList = {
  MainTabsScreen: {}
  [PlaceholderScreenName]: PlaceholderScreenParams
  [AuthScreenName]: AuthScreenParams
  [MainScreenName]: MainScreenParams
  [SearchUsersScreenName]: SearchUsersScreenParams
  [UserScreenName]: UserScreenParams
  [CurrentUserScreenName]: CurrentUserScreenParams
  [ChatScreenName]: ChatScreenParams
  [InterestsScreenName]: InterestsScreenParams
  [EditAvatarScreenName]: EditAvatarScreenParams
  [EditProfileScreenName]: EditProfileScreenParams
}

const Stack = createStackNavigator<RootStackParamList>()
const MainTabs = createBottomTabNavigator<RootStackParamList>()

const MainTabsScreen = () => {
  return (
    <MainTabs.Navigator tabBar={MainTabsComponent}>
      <MainTabs.Screen name={MainScreenName} component={MainScreen} />
      <MainTabs.Screen
        name={SearchUsersScreenName}
        component={SearchUsersScreen}
      />
      <MainTabs.Screen
        name={CurrentUserScreenName}
        component={CurrentUserScreen}
      />
    </MainTabs.Navigator>
  )
}

export const App: React.FC<{}> = () => {
  const isLoading = useObserver(() => auth.loading)
  const isLoggedIn = useObserver(() => auth.loggedIn)

  if (isLoading) {
    return null
  }

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApolloProvider client={apolloClient}>
        <ApplicationProvider {...eva} theme={agoriTheme}>
          <PortalProvider>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName={PlaceholderScreenName}
                headerMode="none"
              >
                {isLoggedIn ? (
                  <>
                    <Stack.Screen
                      name="MainTabsScreen"
                      component={MainTabsScreen}
                    />
                    <Stack.Screen
                      name={UserScreenName}
                      component={UserScreen}
                    />
                    <Stack.Screen
                      name={ChatScreenName}
                      component={ChatScreen}
                    />
                    <Stack.Screen
                      name={InterestsScreenName}
                      component={InterestsScreen}
                    />
                    <Stack.Screen
                      name={EditAvatarScreenName}
                      component={EditAvatarScreen}
                    />
                    <Stack.Screen
                      name={EditProfileScreenName}
                      component={EditProfileScreen}
                    />
                  </>
                ) : (
                  <>
                    <Stack.Screen
                      name={PlaceholderScreenName}
                      component={PlaceholderScreen}
                    />
                    <Stack.Screen
                      name={AuthScreenName}
                      component={AuthScreen}
                    />
                  </>
                )}
              </Stack.Navigator>
            </NavigationContainer>
          </PortalProvider>
        </ApplicationProvider>
      </ApolloProvider>
    </>
  )
}

import React from 'react'
import { useObserver } from 'mobx-react-lite'
import auth from 'utils/auth'

import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import * as eva from '@eva-design/eva'
import { agoriTheme } from 'utils/theme'
import { EvaIconsPack } from '@ui-kitten/eva-icons'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {
  PlaceholderScreenName,
  PlaceholderScreen,
  PlaceholderScreenParams,
} from 'screens/Placeholder'
import { AuthScreenName, AuthScreenParams, AuthScreen } from 'screens/Auth'
import { MainScreenName, MainScreenParams, MainScreen } from 'screens/Main'

export type RootStackParamList = {
  [PlaceholderScreenName]: PlaceholderScreenParams
  [AuthScreenName]: AuthScreenParams
  [MainScreenName]: MainScreenParams
}
const Stack = createStackNavigator<RootStackParamList>()

export const App: React.FC<{}> = () => {
  const isLoading = useObserver(() => auth.loading)
  const isLoggedIn = useObserver(() => auth.loggedIn)

  if (isLoading) {
    return null
  }

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={agoriTheme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={PlaceholderScreenName}
            headerMode="none"
          >
            {isLoggedIn ? (
              <>
                <Stack.Screen name={MainScreenName} component={MainScreen} />
              </>
            ) : (
              <>
                <Stack.Screen
                  name={PlaceholderScreenName}
                  component={PlaceholderScreen}
                />
                <Stack.Screen name={AuthScreenName} component={AuthScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </>
  )
}

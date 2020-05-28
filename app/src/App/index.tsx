import React from 'react'

import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import * as eva from '@eva-design/eva'
import { agoriTheme } from 'utils/theme'
import { EvaIconsPack } from '@ui-kitten/eva-icons'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {
  PlaceholderScreenName,
  PlaceholderProps,
  PlaceholderScreen,
} from 'screens/Placeholder'

export type RootStackParamList = {
  [PlaceholderScreenName]: PlaceholderProps
}
const Stack = createStackNavigator<RootStackParamList>()

export function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={agoriTheme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={PlaceholderScreenName}
            headerMode="none"
          >
            <Stack.Screen
              name={PlaceholderScreenName}
              component={PlaceholderScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </>
  )
}

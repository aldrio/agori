import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { agoriTheme } from 'utils/theme'
import * as eva from '@eva-design/eva'
import { EvaIconsPack } from '@ui-kitten/eva-icons'

export type MockedAppProps = {}
export const MockedApp: React.FC<MockedAppProps> = ({ children }) => {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={agoriTheme}>
        {children}
      </ApplicationProvider>
    </>
  )
}

const Stack = createStackNavigator()
export type MockedNavigationProps = {
  component: React.ComponentType<any>
  initialParams?: any
}
export const MockedNavigation: React.FC<MockedNavigationProps> = ({
  component,
  initialParams = {},
}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MockedScreen"
          component={component}
          initialParams={initialParams}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

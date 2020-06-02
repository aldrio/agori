import React from 'react'
import styles from './styles'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Screen } from 'components/Screen'
import { Text, Button } from '@ui-kitten/components'

export const MainScreenName = 'MainScreen'
export type MainScreenParams = {}
type MainScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof MainScreenName
>
type MainScreenRouteProp = RouteProp<RootStackParamList, typeof MainScreenName>

export type MainProps = {
  navigation: MainScreenNavigationProp
  route: MainScreenRouteProp
}
export const MainScreen: React.FC<MainProps> = ({ navigation, route }) => {
  return (
    <Screen title="Main">
      <Text>MainScreen</Text>
      <Button
        onPress={() => {
          navigation.navigate('SearchUsersScreen', {})
        }}
      >
        Search users
      </Button>
    </Screen>
  )
}

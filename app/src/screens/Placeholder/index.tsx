import React from 'react'
import styles from './styles'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Screen } from 'components/Screen'
import { Text } from '@ui-kitten/components'

export const PlaceholderScreenName = 'PlaceholderScreen'
export type PlaceholderScreenParams = {}
type PlaceholderScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof PlaceholderScreenName
>
type PlaceholderScreenRouteProp = RouteProp<
  RootStackParamList, 
  typeof PlaceholderScreenName
>

export type PlaceholderProps = {
  navigation: PlaceholderScreenNavigationProp
  route: PlaceholderScreenRouteProp
}
export const PlaceholderScreen: React.FC<PlaceholderProps> = ({ navigation, route }) => {
  return (
    <Screen title="Placeholder" back>
      <Text>PlaceholderScreen</Text>
    </Screen>
  )
}

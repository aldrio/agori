---
to: src/screens/<%= h.inflection.camelize(name, false) %>/index.tsx
---
import React from 'react'
import styles from './styles'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Screen } from 'components/Screen'
import { Text } from '@ui-kitten/components'

export const <%= h.inflection.camelize(name, false) %>ScreenName = '<%= h.inflection.camelize(name, false) %>Screen'
export type <%= h.inflection.camelize(name, false) %>ScreenParams = {}
type <%= h.inflection.camelize(name, false) %>ScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof <%= h.inflection.camelize(name, false) %>ScreenName
>
type <%= h.inflection.camelize(name, false) %>ScreenRouteProp = RouteProp<
  RootStackParamList, 
  typeof <%= h.inflection.camelize(name, false) %>ScreenName
>

export type <%= h.inflection.camelize(name, false) %>Props = {
  navigation: <%= h.inflection.camelize(name, false) %>ScreenNavigationProp
  route: <%= h.inflection.camelize(name, false) %>ScreenRouteProp
}
export const <%= h.inflection.camelize(name, false) %>Screen: React.FC<<%= h.inflection.camelize(name, false) %>Props> = ({ navigation, route }) => {
  return (
    <Screen title="<%= h.inflection.camelize(name, false) %>" back>
      <Text><%= h.inflection.camelize(name, false) %>Screen</Text>
    </Screen>
  )
}

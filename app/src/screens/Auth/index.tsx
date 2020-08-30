import React, { useState } from 'react'
import styles from './styles'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Screen } from 'components/Screen'
import { Button } from '@ui-kitten/components'
import authManager from 'utils/auth'

export const AuthScreenName = 'AuthScreen'
export type AuthScreenParams = {}
type AuthScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof AuthScreenName
>
type AuthScreenRouteProp = RouteProp<RootStackParamList, typeof AuthScreenName>

export type AuthProps = {
  navigation: AuthScreenNavigationProp
  route: AuthScreenRouteProp
}
export const AuthScreen: React.FC<AuthProps> = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <Screen title="Auth" back>
      <Button
        onPress={async () => {
          try {
            setIsLoading(true)
            await authManager.login()
          } catch (error) {
            console.log('error logging in', error)
          } finally {
            setIsLoading(false)
          }
        }}
        disabled={isLoading}
      >
        Login
      </Button>
    </Screen>
  )
}

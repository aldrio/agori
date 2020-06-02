import React, { useState } from 'react'
import styles from './styles'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Screen } from 'components/Screen'
import { Button, Input } from '@ui-kitten/components'
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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <Screen title="Auth" back>
      <Input value={email} onChangeText={setEmail} />
      <Input value={password} onChangeText={setPassword} />
      <Button
        onPress={async () => {
          await authManager.login(email, password)
        }}
      >
        Login
      </Button>
    </Screen>
  )
}

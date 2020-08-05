import React, { useState } from 'react'
import styles from './styles'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Screen } from 'components/Screen'
import { useTheme } from '@ui-kitten/components'
import { AvatarDesign } from 'components/AvatarDesign'
import { View, useWindowDimensions } from 'react-native'
import {
  AvatarDesignData,
  getRandomAvatarDesignData,
} from 'components/AvatarDesign/pieces'
import { AvatarDesginCustomizer } from 'components/AvatarDesignCustomizer'

export const AvatarScreenName = 'AvatarScreen'
export type AvatarScreenParams = {}
type AvatarScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof AvatarScreenName
>
type AvatarScreenRouteProp = RouteProp<
  RootStackParamList,
  typeof AvatarScreenName
>

export type AvatarProps = {
  navigation: AvatarScreenNavigationProp
  route: AvatarScreenRouteProp
}

export const AvatarScreen: React.FC<AvatarProps> = ({ navigation, route }) => {
  const [design, setDesign] = useState<AvatarDesignData>(() =>
    getRandomAvatarDesignData()
  )

  const theme = useTheme()

  const { width, height } = useWindowDimensions()
  const size = Math.min(height - 450, width * 0.75)

  return (
    <Screen title="" back padding={false} noScroll>
      <View
        style={[styles.avatar, { backgroundColor: theme['color-primary-100'] }]}
      >
        <AvatarDesign size={size} design={design} />
      </View>
      <AvatarDesginCustomizer design={design} onDesignChange={setDesign} />
    </Screen>
  )
}

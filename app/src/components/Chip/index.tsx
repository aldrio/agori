import React from 'react'
import styles from './styles'
import {
  View,
  TouchableNativeFeedback,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { Text, useTheme } from '@ui-kitten/components'

export type ChipProps = {
  label: string
  style?: StyleProp<ViewStyle>
  active?: boolean
  onPress?: () => void
  onLongPress?: () => void
}

export const Chip: React.FC<ChipProps> = ({
  label,
  style,
  active,
  onPress,
  onLongPress,
}) => {
  const theme = useTheme()

  return (
    <TouchableNativeFeedback onPress={onPress} onLongPress={onLongPress}>
      <View
        style={[
          styles.chip,
          active && { backgroundColor: theme['color-primary-200'] },
          style,
        ]}
      >
        <Text>{label}</Text>
      </View>
    </TouchableNativeFeedback>
  )
}

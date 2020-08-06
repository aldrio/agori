import React from 'react'
import styles from './styles'
import { View, Image } from 'react-native'

const unknown = require('./unknown.png')

export type UnknownAvatarDesignProps = {
  size: number
}

/**
 * Shows a placeholder avatar
 */
export const UnknownAvatarDesign: React.FC<UnknownAvatarDesignProps> = ({
  size,
}) => {
  return (
    <View style={[styles.unknownAvatarDesign]}>
      <Image
        source={unknown}
        resizeMode="contain"
        style={{ width: size, height: size }}
      />
    </View>
  )
}

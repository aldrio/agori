import React from 'react'
import styles from './styles'
import { Image } from 'react-native'

const unknown = require('./unknown.png') // eslint-disable-line @typescript-eslint/no-var-requires

export type UnknownAvatarDesignProps = {
  size: string | number
}

/**
 * Shows a placeholder avatar
 */
export const UnknownAvatarDesign: React.FC<UnknownAvatarDesignProps> = ({
  size,
}) => {
  return (
    <Image
      source={unknown}
      resizeMode="contain"
      style={{ aspectRatio: 1, width: size, height: undefined }}
    />
  )
}

/**
 * The AvatarDesign module is mostly a wrapper around the avataaars library.
 *
 * It includes translations from the API avatar data to avataaar's in order
 * to allow future upgrades, adding new hair, shirts, etc.
 */

import React from 'react'
import styles from './styles'
import {
  renderAvatarToSvg,
  AvatarDesignProps as InnerAvatarProps,
} from 'avatars'
import Image from 'react-native-remote-svg'

export * from './Piece'

export type AvatarDesignProps = InnerAvatarProps

/**
 * Renders an avatar design in real time
 */
export const AvatarDesign: React.FC<AvatarDesignProps> = ({
  design,
  size,
  avatarStyle,
}) => {
  const svg = renderAvatarToSvg({ design, avatarStyle })
  return (
    <Image
      source={{
        uri: `data:image/svg+xml;utf8,${svg}`,
      }}
      style={{
        width: size,
        height: size,
      }}
    />
  )
}

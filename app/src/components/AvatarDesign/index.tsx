/**
 * The AvatarDesign module is mostly a wrapper around the avataaars library.
 *
 * It includes translations from the API avatar data to avataaar's in order
 * to allow future upgrades, adding new hair, shirts, etc.
 */

import React from 'react'
import styles from './styles'

import { Avatar } from 'react-native-avataaars'
import { AvatarDesignData, toAvataaarsProps } from './pieces'

export * from './Piece'

export type AvatarDesignProps = {
  size: number
  design: AvatarDesignData
}

/**
 * Renders an avatar design in real time
 */
export const AvatarDesign: React.FC<AvatarDesignProps> = ({ size, design }) => {
  const props = toAvataaarsProps(design)

  return (
    <Avatar
      size={size}
      avatarStyle="Tranpadrent"
      {...props}
      style={undefined}
    />
  )
}

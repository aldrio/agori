import React from 'react'
import Avatar from 'avataaars'
import { AvatarDesignData, toAvataaarsProps } from './data'

export enum AvatarStyle {
  Transparent = 'Transparent',
  Circle = 'Circle',
}

export type AvatarDesignProps = {
  size?: number
  design: AvatarDesignData
  avatarStyle?: AvatarStyle
}

/**
 * Renders an avatar design in real time
 */
export const AvatarDesign: React.FC<AvatarDesignProps> = ({
  size,
  design,
  avatarStyle = AvatarStyle.Circle,
}) => {
  // Translate AvatarDesignData to avataaar props
  const props = toAvataaarsProps(design)

  return (
    <Avatar
      style={{ width: size, height: size }}
      avatarStyle={avatarStyle}
      {...props}
    />
  )
}

import React from 'react'
import styles from './styles'
import {
  AvatarDesignPieceProps as InnerPieceProps,
  DISPLAY_SCALES,
  renderPieceToSvg,
  getInnerProps,
} from 'avatars'
import { View } from 'react-native'
import Image from 'react-native-remote-svg'

export type AvatarDesignPieceProps = InnerPieceProps

/**
 * An individual piece for an avatar design
 */
export const AvatarDesignPiece: React.FC<AvatarDesignPieceProps> = (props) => {
  // Prefer modifier piece id for scaling
  const displayScale = DISPLAY_SCALES[props.modifierPieceId || props.pieceId]

  // Cache to help performance
  const svg = React.useMemo(() => {
    return renderPieceToSvg(props)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, Object.values(getInnerProps(props)))

  return (
    <View
      style={[
        styles.piece,
        {
          width: props.size,
          height: props.size,
          top: displayScale?.top,
          left: displayScale?.left,
        },
      ]}
    >
      <Image
        source={{
          uri: `data:image/svg+xml;utf8,${svg}`,
        }}
        style={{
          width: props.size * (displayScale?.scale || 1.0),
          height: props.size * (displayScale?.scale || 1.0),
        }}
      />
    </View>
  )
}

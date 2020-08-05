import React from 'react'
import styles from './styles'
import { Piece } from 'react-native-avataaars'
import {
  PieceId,
  PieceVariantId,
  toAvataaarsType,
  toAvataaarsProp,
  AvatarDesignData,
  Pieces,
} from '../pieces'
import { View } from 'react-native'

// Magical numbers to make the pieces align nicely
type Scale = { scale: number; top: string; left: string }
const DISPLAY_SCALES: { [key: string]: Scale | undefined } = {
  mouth: {
    scale: 3.0,
    top: '-25%',
    left: '-18%',
  },
  eyebrows: {
    scale: 2.5,
    top: '35%',
    left: '-7%',
  },
  eyes: {
    scale: 2.5,
    top: '20%',
    left: '-7%',
  },
  accessories: {
    scale: 1.7,
    top: '-20%',
    left: '-35%',
  },
  skinColor: {
    scale: 2.0,
    top: '-50%',
    left: '-50%',
  },
  facialHair: {
    scale: 1.5,
    top: '-25%',
    left: '-25%',
  },
  clothesColor: {
    scale: 2.5,
    top: '-150%',
    left: '-75%',
  },
  clothesGraphic: {
    scale: 2.5,
    top: '-150%',
    left: '-75%',
  },
  facialHairColor: {
    scale: 2.5,
    top: '-90%',
    left: '-75%',
  },
}

export type AvatarDesignPieceProps = {
  size: number
  design: AvatarDesignData

  pieceId: PieceId
  variantId: PieceVariantId

  modifierPieceId?: PieceId
  modifierVariantId?: PieceVariantId
}

/**
 * An individual piece for an avatar design
 */
export const AvatarDesignPiece: React.FC<AvatarDesignPieceProps> = ({
  size,
  design,
  pieceId,
  variantId,
  modifierPieceId,
  modifierVariantId,
}) => {
  const props: any = {}

  props[toAvataaarsProp(pieceId)] = variantId
  props['pieceType'] = toAvataaarsType(pieceId)

  // Include only the design props that can modify this piece variant
  const modifierDeps = Pieces[pieceId].variants[variantId].modifiers.map(
    (m) => {
      const vid = design[m]
      props[toAvataaarsProp(m)] = vid
      return vid
    }
  )

  // Override modifiers that we're testing (not part of the design)
  if (modifierPieceId && modifierVariantId) {
    props[toAvataaarsProp(modifierPieceId)] = modifierVariantId
  }

  // Cache to help performance
  const piece = React.useMemo(() => {
    // Prefer modifier piece id for scaling
    const displayScale = DISPLAY_SCALES[modifierPieceId || pieceId]
    return (
      <View
        style={[
          styles.piece,
          {
            width: size,
            height: size,
            top: displayScale?.top,
            left: displayScale?.left,
          },
        ]}
      >
        <Piece
          avatarStyle="Circle"
          size={size}
          pieceSize={(size * (displayScale?.scale || 1.0)).toString()}
          {...props}
          style={undefined}
        />
      </View>
    )
  }, [
    size,
    pieceId,
    variantId,
    modifierPieceId,
    modifierVariantId,
    ...modifierDeps,
  ])

  return piece
}

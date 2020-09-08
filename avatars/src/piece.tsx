import React from 'react'
import { Piece } from 'avataaars'
import {
  PieceId,
  PieceVariantId,
  toAvataaarsType,
  toAvataaarsProp,
  AvatarDesignData,
  Pieces,
} from './data'

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
export const AvatarDesignPiece: React.FC<AvatarDesignPieceProps> = (props) => {
  const innerProps = getInnerProps(props)

  // Cache to help performance
  const piece = React.useMemo(() => {
    return <Piece avatarStyle="Circle" {...innerProps} style={undefined} />
  }, Object.values(innerProps))

  return piece
}

export const getInnerProps = ({
  size,
  design,
  pieceId,
  variantId,
  modifierPieceId,
  modifierVariantId,
}: AvatarDesignPieceProps) => {
  const props: any = {}

  props[toAvataaarsProp(pieceId)] = variantId
  props['pieceType'] = toAvataaarsType(pieceId)

  // Include only the design props that can modify this piece variant
  Pieces[pieceId].variants[variantId].modifiers.map((m) => {
    props[toAvataaarsProp(m)] = design[m]
  })

  // Override modifiers that we're testing (not part of the design)
  if (modifierPieceId && modifierVariantId) {
    props[toAvataaarsProp(modifierPieceId)] = modifierVariantId
  }

  props['size'] = size
  props['pieceSize'] = size

  return props
}

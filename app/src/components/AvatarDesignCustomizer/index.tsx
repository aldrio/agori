import React, { useState } from 'react'
import styles from './styles'
import { View, useWindowDimensions, ScrollView, Image, ImageProps } from 'react-native'
import {
  BottomNavigation,
  BottomNavigationTab,
  useTheme,
} from '@ui-kitten/components'
import {
  AvatarDesignData,
  TopLevelPieceTypeIds,
  Pieces,
  Piece,
  PieceId, PieceVariantId
} from 'avatars'
import { TouchableOpacity } from 'react-native-gesture-handler'
import pieces from './pieces'

type PieceImage = {
  size: number;
  design: AvatarDesignData;
  pieceId: PieceId;
  variantId: PieceVariantId;
  modifierPieceId?: PieceId;
  modifierVariantId?: PieceVariantId;
} & Partial<ImageProps>

const PieceImage: React.FC<PieceImage> = ({
  size,
  design,
  pieceId,
  variantId,
  modifierPieceId = pieceId,
  modifierVariantId = variantId,
  ...imageProps
}) => {
  const piece = Pieces[pieceId]
  const variant = piece.variants[variantId]

  const pvs = [{ pieceId, pieceVariantId: variantId }].concat(variant.modifiers.map((mid) => ({
    pieceId: mid,
    pieceVariantId: mid === modifierPieceId ? modifierVariantId : design[mid],
  })))

  const key = pvs
    .map(
      (pv) =>
        `${pv.pieceId}-${pv.pieceVariantId}${pv.pieceId === modifierPieceId ? '-m' : ''}`
    )
    .join('_')

  return <Image
    source={pieces[key]}
    style={{ width: size, height: size }}
    {...imageProps}
  />
}

type PieceToggleProps = {
  active: boolean
  onPress: () => void
} & PieceImage

const PieceToggle: React.FC<PieceToggleProps> = ({
  onPress,
  active,
  ...imageProps
}) => {
  const theme = useTheme()

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.piece,
          active ? { borderColor: theme['color-primary-500'] } : {},
        ]}
      >
        <PieceImage {...imageProps} />
      </View>
    </TouchableOpacity>
  )
}

export type AvatarDesignCustomizerProps = {
  design: AvatarDesignData
  onDesignChange: (design: AvatarDesignData) => void
}

export const AvatarDesginCustomizer: React.FC<AvatarDesignCustomizerProps> = ({
  design,
  onDesignChange,
}) => {
  const [page, setPage] = useState(0)

  // Calculate piece sizing
  const windowWidth = useWindowDimensions().width
  // 3 columns on bigger screens, 2 on smaller
  const columns = Math.floor(windowWidth / 100)

  const pieceWidth = (windowWidth - 24) / columns - 12
  const modifierPieceWidth = ((windowWidth - 24) / 3 - 12) * 0.3

  const pieceId = TopLevelPieceTypeIds[page]
  const piece = Pieces[pieceId]

  const selectedPieceVariantId = design[pieceId]
  const selectedPiece = piece.variants[selectedPieceVariantId]

  return (
    <View style={styles.avatarDesignForm}>
      {/* Render list of variants for selected page */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.pieces}
        key={page}
      >
        {Object.values(piece.variants).map((variant) => (
          <PieceToggle
            key={`${pieceId}-${variant.id}`}
            onPress={() =>
              onDesignChange({
                ...design,
                [pieceId]: variant.id,
              })
            }
            active={variant.id === selectedPieceVariantId}
            size={pieceWidth}
            design={design}
            pieceId={pieceId}
            variantId={variant.id}
          />
        ))}
      </ScrollView>

      {/* Render smaller panes for each modifier piece */}
      {selectedPiece.modifiers
        .map<[PieceId, Piece]>((pieceId) => [pieceId, Pieces[pieceId]])
        .map(([modifierPieceId, modifierPiece]) => (
          <View key={modifierPieceId} style={styles.modifierPanel}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.modifierPanelInner}
            >
              {Object.values(modifierPiece.variants).map((variant) => (
                <PieceToggle
                  key={`${selectedPieceVariantId}-${variant.id}`}
                  onPress={() =>
                    onDesignChange({
                      ...design,
                      [modifierPieceId]: variant.id,
                    })
                  }
                  active={variant.id === design[modifierPieceId]}
                  size={modifierPieceWidth}
                  design={design}
                  pieceId={pieceId}
                  variantId={selectedPieceVariantId}
                  modifierPieceId={modifierPieceId}
                  modifierVariantId={variant.id}
                />
              ))}
            </ScrollView>
          </View>
        ))}

      {/* Bottom navigation for top level items */}
      <BottomNavigation
        selectedIndex={page}
        onSelect={setPage}
        style={styles.tabPanel}
      >
        {/* TODO: Use icons */}
        {TopLevelPieceTypeIds.map((p) => (
          <BottomNavigationTab key={p} title={p} />
        ))}
      </BottomNavigation>
    </View>
  )
}

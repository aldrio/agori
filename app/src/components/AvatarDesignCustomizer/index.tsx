import React, { useState } from 'react'
import styles from './styles'
import { View, useWindowDimensions, ScrollView } from 'react-native'
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
  PieceId,
} from 'components/AvatarDesign/pieces'
import {
  AvatarDesignPiece,
  AvatarDesignPieceProps,
} from 'components/AvatarDesign/Piece'
import { TouchableOpacity } from 'react-native-gesture-handler'

type PieceToggleProps = {
  active: boolean
  onPress: () => void
} & AvatarDesignPieceProps

const PieceToggle: React.FC<PieceToggleProps> = ({
  onPress,
  active,
  ...props
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
        <AvatarDesignPiece {...props} />
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

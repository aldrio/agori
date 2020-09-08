import { renderPieceToPngBuffer } from '..'
import { promises as fs } from 'fs'
import path from 'path'
import {
  PieceIds,
  Pieces,
  PieceId,
  AvatarDesignData,
  PieceVariantId,
} from '../data'

/**
 * Generate Pieces generates a directory of images with every Avatar Piece variant -> modifier combination
 */
;(async () => {
  const OUT_DIR = './output'
  const OUT_SIZE = 100
  console.log(`Generating pieces to ${OUT_DIR}`)

  await fs.mkdir(OUT_DIR, { recursive: true })

  /**
   * Runs addPieceVariant for every variant on this piece
   */
  async function addPiece(
    existingDesign: AvatarDesignData,
    existingKey: string,
    pieceId: PieceId,
    rootPieceId?: PieceId,
    rootPieceVariantId?: PieceVariantId
  ) {
    const piece = Pieces[pieceId]
    const variants = Object.keys(piece.variants)
    await Promise.all(
      variants.map(async (vid) => {
        await addPieceVariant(
          existingDesign,
          existingKey,
          pieceId,
          vid,
          rootPieceId || pieceId,
          rootPieceVariantId || vid
        )
      })
    )
  }

  /**
   * Writes the image if this piece variant is a leaf node in the avatar design graph
   * Otherwise it recurses and runs addPiece for every possible modification of the current piece variant
   */
  async function addPieceVariant(
    existingDesign: AvatarDesignData,
    existingKey: string,
    pieceId: PieceId,
    pieceVariantId: PieceVariantId,
    rootPieceId: PieceId,
    rootPieceVariantId: PieceVariantId
  ) {
    const piece = Pieces[pieceId]
    const variant = piece.variants[pieceVariantId]

    const design = {
      ...existingDesign,
      [pieceId]: pieceVariantId,
    }
    const key = `${existingKey}${pieceId}-${pieceVariantId}`
    const { modifiers } = variant

    if (modifiers.length === 0) {
      const buffer = await renderPieceToPngBuffer({
        size: OUT_SIZE,
        design,
        pieceId: rootPieceId,
        variantId: rootPieceVariantId,
        modifierPieceId: pieceId,
        modifierVariantId: pieceVariantId,
      })
      await fs.writeFile(path.join(OUT_DIR, `${key}.png`), buffer)
    } else {
      await Promise.all(
        modifiers.map(async (modifier) => {
          addPiece(design, `${key}_`, modifier, rootPieceId, rootPieceVariantId)
        })
      )
    }
  }

  // Default values for the cases where there's multiple modifiers that affect eachother
  const design = {
    clothesColor: 'Blue03',
    clothesGraphic: 'Deer',
  } as AvatarDesignData

  // Add every topLevel piece
  await Promise.all(
    PieceIds.map(async (pieceId) => {
      if (Pieces[pieceId].topLevel) {
        await addPiece(design, '', pieceId)
      }
    })
  )

  console.log('Done')
})()

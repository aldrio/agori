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

function cartesianProduct<T>(...allEntries: T[][]): T[][] {
  return allEntries.reduce<T[][]>(
    (results, entries) =>
      results
        .map((result) => entries.map((entry) => result.concat([entry])))
        .reduce((subResults, result) => subResults.concat(result), []),
    [[]]
  )
}

/**
 * Generate Pieces generates a directory of images with every Avatar Piece variant -> modifier combination
 */
; (async () => {
  const OUT_DIR = '../app/src/components/AvatarDesignCustomizer/pieces'
  const OUT_SIZE = 300
  const OUT_MODIFIER_SIZE = 90
  console.log(`Generating pieces to ${OUT_DIR}`)

  // await fs.mkdir(OUT_DIR, { recursive: true })

  const keys: string[] = []

  /**
   * Runs addPieceVariant for every variant on this piece
   */
  async function addPieceVariant(
    pieceId: PieceId,
    pieceVariantId: PieceVariantId
  ) {
    const piece = Pieces[pieceId]
    const variant = piece.variants[pieceVariantId]
    const pieceVariation = {
      pieceId: pieceId,
      pieceVariantId: pieceVariantId,
    }

    const modifiersPieceVariations = variant.modifiers.map((mpid) => {
      const piece = Pieces[mpid]
      return Object.keys(piece.variants).map((pvid) => ({
        pieceId: mpid,
        pieceVariantId: pvid,
      }))
    })

    const completeVariations = cartesianProduct(
      ...modifiersPieceVariations
    ).map((pvs) => [pieceVariation, ...pvs])

    for (let pvs of completeVariations) {
      const design: Partial<AvatarDesignData> = {}
      pvs.forEach((pv) => (design[pv.pieceId] = pv.pieceVariantId))

      for (let i = 0; i < pvs.length; i++) {
        const pv = pvs[i]
        const key = pvs
          .map(
            (pv, index) =>
              `${pv.pieceId}-${pv.pieceVariantId}${index === i ? '-m' : ''}`
          )
          .join('_')
        keys.push(key)

        const buffer = await renderPieceToPngBuffer({
          size: i === 0 ?  OUT_SIZE : OUT_MODIFIER_SIZE,
          design: design as AvatarDesignData,
          pieceId: pieceId,
          variantId: pieceVariantId,
          modifierPieceId: pv.pieceId,
          modifierVariantId: pv.pieceVariantId,
        })
        await fs.writeFile(path.join(OUT_DIR, `${key}.png`), buffer)
      }
    }
  }

  // Add every topLevel piece
  for (let pieceId of PieceIds) {
    const piece = Pieces[pieceId]
    if (piece.topLevel) {
      const variants = Object.keys(piece.variants)
      for (let vid of variants) {
        await addPieceVariant(pieceId, vid)
      }
    }
  }

  // Write keys to file with requires for use in the app
  let file = `
    export default {
      ${keys.map((key) => `"${key}": require('./${key}.png')`).join(',')}
    }
  `
  await fs.writeFile(path.join(OUT_DIR, `index.ts`), file)

  console.log('Done')
})()

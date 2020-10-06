import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { AvatarDesign, AvatarDesignProps } from './avatar'
import type Sharp from 'sharp'
import { AvatarDesignPiece, AvatarDesignPieceProps } from './piece'
import { DISPLAY_SCALES } from './data'

export const renderAvatarToPngBuffer = async (
  props: AvatarDesignProps
): Promise<Buffer> => {
  let sharp: typeof Sharp
  try {
    sharp = require.call(null, 'sharp') as typeof Sharp
  } catch (error) {
    throw new Error('sharp not available')
  }

  const size = props.size || 300

  const svg = renderAvatarToSvg(props)
  return await sharp(Buffer.from(svg))
    .resize(size * 2)
    .png({ compressionLevel: 0 })
    .resize(size)
    .toBuffer()
}

export const renderPieceToPngBuffer = async (
  props: AvatarDesignPieceProps
): Promise<Buffer> => {
  let sharp: typeof Sharp
  try {
    sharp = require.call(null, 'sharp') as typeof Sharp
  } catch (error) {
    throw new Error('sharp not available')
  }

  // Use display scales info to crop and scale pieces
  // Prefer choosing display scale based on modifier first to allow more specific displays
  const displayScale = DISPLAY_SCALES[props.modifierPieceId || props.pieceId]

  const size = props.size || 300
  const scaledSize = Math.round((displayScale?.scale || 1.0) * size)

  // Calculate boundaries
  const marginLeft = Math.round(
    -(size * parseFloat(displayScale?.left || '0')) / 100
  )
  const marginRight = Math.round(scaledSize - size - marginLeft)
  const marginTop = Math.round(
    -(size * parseFloat(displayScale?.top || '0')) / 100
  )
  const marginBottom = Math.round(scaledSize - size - marginTop)

  // Render svg
  const svg = renderPieceToSvg({ ...props, size: scaledSize }).replace(
    'mask="url(#5678)"',
    ''
  ) // Fixes a bug with rendering skinColor

  return await sharp(new Buffer(svg))
    .resize(scaledSize)
    .png({ compressionLevel: 9 })
    // Extract subsection containing final image
    .extract({
      left: Math.max(0, marginLeft),
      width: Math.min(size, size + marginLeft, size + marginRight),
      top: Math.max(0, marginTop),
      height: Math.min(size, size + marginTop, size + marginBottom),
    })
    // Extend cut off parts to keep final size
    .extend({
      left: Math.max(0, -marginLeft),
      right: Math.max(0, -marginRight),
      top: Math.max(0, -marginTop),
      bottom: Math.max(0, -marginBottom),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer()
}

export const renderAvatarToSvg = (props: AvatarDesignProps) => {
  return ReactDOMServer.renderToString(<AvatarDesign {...props} />)
}

export const renderPieceToSvg = (props: AvatarDesignPieceProps) => {
  return ReactDOMServer.renderToString(<AvatarDesignPiece {...props} />)
}

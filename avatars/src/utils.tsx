import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { AvatarDesign, AvatarDesignProps } from './avatar'
import type Sharp from 'sharp'
import { AvatarDesignPiece, AvatarDesignPieceProps } from './piece'

export const renderAvatarToPngBuffer = async (
  props: AvatarDesignProps
): Promise<Buffer> => {
  let sharp: any
  try {
    sharp = require.call(null, 'sharp') as typeof Sharp
  } catch (error) {
    throw new Error('sharp not available')
  }

  const size = props.size || 300

  const svg = renderAvatarToSvg(props)
  return await sharp(new Buffer(svg))
    .resize(size * 2)
    .png({ compressionLevel: 0 })
    .resize(size)
    .toBuffer()
}

export const renderAvatarToSvg = (props: AvatarDesignProps) => {
  return ReactDOMServer.renderToString(<AvatarDesign {...props} />)
}

export const renderPieceToSvg = (props: AvatarDesignPieceProps) => {
  return ReactDOMServer.renderToString(<AvatarDesignPiece {...props} />)
}

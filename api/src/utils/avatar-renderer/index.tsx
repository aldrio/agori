import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { AvatarDesignData, toAvataaarsProps } from './pieces'
import Avatar from 'avataaars'
import sharp from 'sharp'

// export const uploadAvatar

export const renderAvatarToPngBuffer = async (
  design: AvatarDesignData,
  size: number
): Promise<Buffer> => {
  const svg = renderAvatarToSvg(design)
  return await sharp(new Buffer(svg))
    .resize(size * 2)
    .png({ compressionLevel: 0 })
    .resize(size)
    .toBuffer()
}

export const renderAvatarToSvg = (design: AvatarDesignData) => {
  return ReactDOMServer.renderToString(
    <AvatarDesign design={design} size={300} />
  )
}

export type AvatarDesignProps = {
  size: number
  design: AvatarDesignData
}

/**
 * Renders an avatar design in real time
 */
export const AvatarDesign: React.FC<AvatarDesignProps> = ({ size, design }) => {
  const props = toAvataaarsProps(design)

  return (
    <Avatar
      style={{
        width: size,
        height: size,
      }}
      avatarStyle="Circle"
      {...props}
    />
  )
}

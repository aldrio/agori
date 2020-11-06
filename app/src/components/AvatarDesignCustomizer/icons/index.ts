import { PieceId } from 'avatars'
import { ImageURISource } from 'react-native'

const ICON_MAP: Partial<Record<PieceId, ImageURISource>> = {
  accessories: require('./accessories.png'),
  clothes: require('./clothes.png'),
  eyebrows: require('./eyebrows.png'),
  eyes: require('./eyes.png'),
  facialHair: require('./facialHair.png'),
  hair: require('./hair.png'),
  mouth: require('./mouth.png'),
  skinColor: require('./skinColor.png'),
} as const

export default ICON_MAP

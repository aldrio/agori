/**
 * List of piece types
 */
export const PieceIds = [
  'skinColor',
  'hairColor',
  'hair',
  'hatColor',
  'accessories',
  'facialHair',
  'facialHairColor',
  'clothes',
  'clothesColor',
  'clothesGraphic',
  'eyes',
  'eyebrows',
  'mouth',
] as const

/**
 * Type of a Piece Id
 */
export type PieceId = typeof PieceIds[number]

/**
 * Type of a Piece variant
 */
export type PieceVariantId = string

export type Piece = {
  topLevel: boolean
  variants: Record<PieceVariantId, Variant>
}

export type Variant = {
  id: string
  modifiers: PieceId[]
}

/**
 * An object representing a full avatar design
 */
export type AvatarDesignData = Record<PieceId, PieceVariantId>

/**
 * Map of avatar piece types to ids
 */
export const Pieces: Record<PieceId, Piece> = {
  skinColor: {
    topLevel: true,
    variants: {
      Tanned: { id: 'Tanned', modifiers: [] },
      Yellow: { id: 'Yellow', modifiers: [] },
      Pale: { id: 'Pale', modifiers: [] },
      Light: { id: 'Light', modifiers: [] },
      Brown: { id: 'Brown', modifiers: [] },
      DarkBrown: { id: 'DarkBrown', modifiers: [] },
      Black: { id: 'Black', modifiers: [] },
    },
  },

  hairColor: {
    topLevel: false,
    variants: {
      Auburn: { id: 'Auburn', modifiers: [] },
      Black: { id: 'Black', modifiers: [] },
      Blonde: { id: 'Blonde', modifiers: [] },
      BlondeGolden: { id: 'BlondeGolden', modifiers: [] },
      Brown: { id: 'Brown', modifiers: [] },
      BrownDark: { id: 'BrownDark', modifiers: [] },
      PastelPink: { id: 'PastelPink', modifiers: [] },
      Platinum: { id: 'Platinum', modifiers: [] },
      Red: { id: 'Red', modifiers: [] },
      SilverGray: { id: 'SilverGray', modifiers: [] },
    },
  },
  hair: {
    topLevel: true,
    variants: {
      NoHair: { id: 'NoHair', modifiers: [] },
      Eyepatch: { id: 'Eyepatch', modifiers: [] },
      Hat: { id: 'Hat', modifiers: [] },
      Hijab: { id: 'Hijab', modifiers: ['hatColor'] },
      Turban: { id: 'Turban', modifiers: ['hatColor'] },
      WinterHat1: { id: 'WinterHat1', modifiers: ['hatColor'] },
      WinterHat2: { id: 'WinterHat2', modifiers: ['hatColor'] },
      WinterHat3: { id: 'WinterHat3', modifiers: ['hatColor'] },
      WinterHat4: { id: 'WinterHat4', modifiers: ['hatColor'] },
      LongHairBigHair: { id: 'LongHairBigHair', modifiers: ['hairColor'] },
      LongHairBob: { id: 'LongHairBob', modifiers: ['hairColor'] },
      LongHairBun: { id: 'LongHairBun', modifiers: ['hairColor'] },
      LongHairCurly: { id: 'LongHairCurly', modifiers: ['hairColor'] },
      LongHairCurvy: { id: 'LongHairCurvy', modifiers: ['hairColor'] },
      LongHairDreads: { id: 'LongHairDreads', modifiers: ['hairColor'] },
      LongHairFrida: { id: 'LongHairFrida', modifiers: [] },
      LongHairFro: { id: 'LongHairFro', modifiers: ['hairColor'] },
      LongHairFroBand: { id: 'LongHairFroBand', modifiers: ['hairColor'] },
      LongHairNotTooLong: {
        id: 'LongHairNotTooLong',
        modifiers: ['hairColor'],
      },
      LongHairShavedSides: { id: 'LongHairShavedSides', modifiers: [] },
      LongHairMiaWallace: {
        id: 'LongHairMiaWallace',
        modifiers: ['hairColor'],
      },
      LongHairStraight: { id: 'LongHairStraight', modifiers: ['hairColor'] },
      LongHairStraight2: { id: 'LongHairStraight2', modifiers: ['hairColor'] },
      LongHairStraightStrand: {
        id: 'LongHairStraightStrand',
        modifiers: ['hairColor'],
      },
      ShortHairDreads01: { id: 'ShortHairDreads01', modifiers: ['hairColor'] },
      ShortHairDreads02: { id: 'ShortHairDreads02', modifiers: ['hairColor'] },
      ShortHairFrizzle: { id: 'ShortHairFrizzle', modifiers: ['hairColor'] },
      ShortHairShaggyMullet: {
        id: 'ShortHairShaggyMullet',
        modifiers: ['hairColor'],
      },
      ShortHairShortCurly: {
        id: 'ShortHairShortCurly',
        modifiers: ['hairColor'],
      },
      ShortHairShortFlat: {
        id: 'ShortHairShortFlat',
        modifiers: ['hairColor'],
      },
      ShortHairShortRound: {
        id: 'ShortHairShortRound',
        modifiers: ['hairColor'],
      },
      ShortHairShortWaved: {
        id: 'ShortHairShortWaved',
        modifiers: ['hairColor'],
      },
      ShortHairSides: { id: 'ShortHairSides', modifiers: ['hairColor'] },
      ShortHairTheCaesar: {
        id: 'ShortHairTheCaesar',
        modifiers: ['hairColor'],
      },
      ShortHairTheCaesarSidePart: {
        id: 'ShortHairTheCaesarSidePart',
        modifiers: ['hairColor'],
      },
    },
  },
  accessories: {
    topLevel: true,
    variants: {
      Blank: { id: 'Blank', modifiers: [] },
      Kurt: { id: 'Kurt', modifiers: [] },
      Prescription01: { id: 'Prescription01', modifiers: [] },
      Prescription02: { id: 'Prescription02', modifiers: [] },
      Round: { id: 'Round', modifiers: [] },
      Sunglasses: { id: 'Sunglasses', modifiers: [] },
      Wayfarers: { id: 'Wayfarers', modifiers: [] },
    },
  },
  hatColor: {
    topLevel: false,
    variants: {
      Black: { id: 'Black', modifiers: [] },
      Blue01: { id: 'Blue01', modifiers: [] },
      Blue02: { id: 'Blue02', modifiers: [] },
      Blue03: { id: 'Blue03', modifiers: [] },
      Gray01: { id: 'Gray01', modifiers: [] },
      Gray02: { id: 'Gray02', modifiers: [] },
      Heather: { id: 'Heather', modifiers: [] },
      PastelBlue: { id: 'PastelBlue', modifiers: [] },
      PastelGreen: { id: 'PastelGreen', modifiers: [] },
      PastelOrange: { id: 'PastelOrange', modifiers: [] },
      PastelRed: { id: 'PastelRed', modifiers: [] },
      PastelYellow: { id: 'PastelYellow', modifiers: [] },
      Pink: { id: 'Pink', modifiers: [] },
      Red: { id: 'Red', modifiers: [] },
      White: { id: 'White', modifiers: [] },
    },
  },

  facialHair: {
    topLevel: true,
    variants: {
      Blank: { id: 'Blank', modifiers: [] },
      BeardMedium: { id: 'BeardMedium', modifiers: ['facialHairColor'] },
      BeardLight: { id: 'BeardLight', modifiers: ['facialHairColor'] },
      BeardMajestic: { id: 'BeardMajestic', modifiers: ['facialHairColor'] },
      MoustacheFancy: { id: 'MoustacheFancy', modifiers: ['facialHairColor'] },
      MoustacheMagnum: {
        id: 'MoustacheMagnum',
        modifiers: ['facialHairColor'],
      },
    },
  },

  facialHairColor: {
    topLevel: false,
    variants: {
      Auburn: { id: 'Auburn', modifiers: [] },
      Black: { id: 'Black', modifiers: [] },
      Blonde: { id: 'Blonde', modifiers: [] },
      BlondeGolden: { id: 'BlondeGolden', modifiers: [] },
      Brown: { id: 'Brown', modifiers: [] },
      BrownDark: { id: 'BrownDark', modifiers: [] },
      Platinum: { id: 'Platinum', modifiers: [] },
      Red: { id: 'Red', modifiers: [] },
    },
  },

  clothes: {
    topLevel: true,
    variants: {
      BlazerShirt: { id: 'BlazerShirt', modifiers: [] },
      BlazerSweater: { id: 'BlazerSweater', modifiers: [] },
      CollarSweater: { id: 'CollarSweater', modifiers: ['clothesColor'] },
      GraphicShirt: {
        id: 'GraphicShirt',
        modifiers: ['clothesColor', 'clothesGraphic'],
      },
      Hoodie: { id: 'Hoodie', modifiers: ['clothesColor'] },
      Overall: { id: 'Overall', modifiers: ['clothesColor'] },
      ShirtCrewNeck: { id: 'ShirtCrewNeck', modifiers: ['clothesColor'] },
      ShirtScoopNeck: { id: 'ShirtScoopNeck', modifiers: ['clothesColor'] },
      ShirtVNeck: { id: 'ShirtVNeck', modifiers: ['clothesColor'] },
    },
  },
  clothesColor: {
    topLevel: false,
    variants: {
      Black: { id: 'Black', modifiers: [] },
      Blue01: { id: 'Blue01', modifiers: [] },
      Blue02: { id: 'Blue02', modifiers: [] },
      Blue03: { id: 'Blue03', modifiers: [] },
      Gray01: { id: 'Gray01', modifiers: [] },
      Gray02: { id: 'Gray02', modifiers: [] },
      Heather: { id: 'Heather', modifiers: [] },
      PastelBlue: { id: 'PastelBlue', modifiers: [] },
      PastelGreen: { id: 'PastelGreen', modifiers: [] },
      PastelOrange: { id: 'PastelOrange', modifiers: [] },
      PastelRed: { id: 'PastelRed', modifiers: [] },
      PastelYellow: { id: 'PastelYellow', modifiers: [] },
      Pink: { id: 'Pink', modifiers: [] },
      Red: { id: 'Red', modifiers: [] },
      White: { id: 'White', modifiers: [] },
    },
  },
  clothesGraphic: {
    topLevel: false,
    variants: {
      Bat: { id: 'Bat', modifiers: [] },
      Cumbia: { id: 'Cumbia', modifiers: [] },
      Deer: { id: 'Deer', modifiers: [] },
      Diamond: { id: 'Diamond', modifiers: [] },
      Hola: { id: 'Hola', modifiers: [] },
      Pizza: { id: 'Pizza', modifiers: [] },
      Resist: { id: 'Resist', modifiers: [] },
      Selena: { id: 'Selena', modifiers: [] },
      Bear: { id: 'Bear', modifiers: [] },
      SkullOutline: { id: 'SkullOutline', modifiers: [] },
      Skull: { id: 'Skull', modifiers: [] },
    },
  },
  eyes: {
    topLevel: true,
    variants: {
      Close: { id: 'Close', modifiers: [] },
      Cry: { id: 'Cry', modifiers: [] },
      Default: { id: 'Default', modifiers: [] },
      Dizzy: { id: 'Dizzy', modifiers: [] },
      EyeRoll: { id: 'EyeRoll', modifiers: [] },
      Happy: { id: 'Happy', modifiers: [] },
      Hearts: { id: 'Hearts', modifiers: [] },
      Side: { id: 'Side', modifiers: [] },
      Squint: { id: 'Squint', modifiers: [] },
      Surprised: { id: 'Surprised', modifiers: [] },
      Wink: { id: 'Wink', modifiers: [] },
      WinkWacky: { id: 'WinkWacky', modifiers: [] },
    },
  },
  eyebrows: {
    topLevel: true,
    variants: {
      Angry: { id: 'Angry', modifiers: [] },
      AngryNatural: { id: 'AngryNatural', modifiers: [] },
      Default: { id: 'Default', modifiers: [] },
      DefaultNatural: { id: 'DefaultNatural', modifiers: [] },
      FlatNatural: { id: 'FlatNatural', modifiers: [] },
      RaisedExcited: { id: 'RaisedExcited', modifiers: [] },
      RaisedExcitedNatural: { id: 'RaisedExcitedNatural', modifiers: [] },
      SadConcerned: { id: 'SadConcerned', modifiers: [] },
      SadConcernedNatural: { id: 'SadConcernedNatural', modifiers: [] },
      UnibrowNatural: { id: 'UnibrowNatural', modifiers: [] },
      UpDown: { id: 'UpDown', modifiers: [] },
      UpDownNatural: { id: 'UpDownNatural', modifiers: [] },
    },
  },
  mouth: {
    topLevel: true,
    variants: {
      Concerned: { id: 'Concerned', modifiers: [] },
      Default: { id: 'Default', modifiers: [] },
      Disbelief: { id: 'Disbelief', modifiers: [] },
      Eating: { id: 'Eating', modifiers: [] },
      Grimace: { id: 'Grimace', modifiers: [] },
      Sad: { id: 'Sad', modifiers: [] },
      ScreamOpen: { id: 'ScreamOpen', modifiers: [] },
      Serious: { id: 'Serious', modifiers: [] },
      Smile: { id: 'Smile', modifiers: [] },
      Tongue: { id: 'Tongue', modifiers: [] },
      Twinkle: { id: 'Twinkle', modifiers: [] },
      Vomit: { id: 'Vomit', modifiers: [] },
    },
  },
}

export const TopLevelPieceTypeIds = PieceIds.filter((t) => Pieces[t].topLevel)

/**
 * Convert type to inner avataaar type
 */
export function toAvataaarsType(pieceId: PieceId): string {
  const map: Record<PieceId, string> = {
    skinColor: 'skin',
    hairColor: 'hairColor',
    hair: 'top',
    hatColor: 'hatColor',
    accessories: 'accessories',

    facialHair: 'facialHair',
    facialHairColor: 'facialHairColor',

    clothes: 'clothe',
    clothesColor: 'clothesColor',

    clothesGraphic: 'graphics',
    eyes: 'eyes',
    eyebrows: 'eyebrows',
    mouth: 'mouth',
  }

  return map[pieceId]
}

/**
 * Convert type to inner avataaar prop
 */
export function toAvataaarsProp(pieceId: PieceId): PieceVariantId {
  const map: Record<PieceId, string> = {
    skinColor: 'skinColor',
    hairColor: 'hairColor',
    hair: 'topType',
    hatColor: 'hatColor',
    accessories: 'accessoriesType',
    facialHair: 'facialHairType',
    facialHairColor: 'facialHairColor',
    clothes: 'clotheType',
    clothesColor: 'clotheColor',
    clothesGraphic: 'graphicType',
    eyes: 'eyeType',
    eyebrows: 'eyebrowType',
    mouth: 'mouthType',
  }

  return map[pieceId]
}

/**
 * Convert a AvatarDesignData to a props object to be used with avataaars
 */
export function toAvataaarsProps(design: AvatarDesignData): any {
  return {
    [toAvataaarsProp('skinColor')]: design.skinColor,
    [toAvataaarsProp('hairColor')]: design.hairColor,
    [toAvataaarsProp('hair')]: design.hair,
    [toAvataaarsProp('hatColor')]: design.hatColor,
    [toAvataaarsProp('accessories')]: design.accessories,
    [toAvataaarsProp('facialHair')]: design.facialHair,
    [toAvataaarsProp('facialHairColor')]: design.facialHairColor,
    [toAvataaarsProp('clothes')]: design.clothes,
    [toAvataaarsProp('clothesColor')]: design.clothesColor,
    [toAvataaarsProp('clothesGraphic')]: design.clothesGraphic,
    [toAvataaarsProp('eyes')]: design.eyes,
    [toAvataaarsProp('eyebrows')]: design.eyebrows,
    [toAvataaarsProp('mouth')]: design.mouth,
  }
}

/** Generate a random AvatarDesignData object */
export function getRandomAvatarDesignData(): AvatarDesignData {
  const design: AvatarDesignData = {} as AvatarDesignData

  PieceIds.forEach((pieceId) => {
    const { variants } = Pieces[pieceId]
    const v = Object.values(variants)
    design[pieceId] = v[Math.floor(Math.random() * v.length)].id
  })

  return design
}

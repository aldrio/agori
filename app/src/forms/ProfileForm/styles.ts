import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  profileForm: {},

  editAvatarButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  editAvatarIcon: {
    marginTop: 24,
    width: 32,
    height: 32,
    // Negative margin same as width so the icon is ignored by the centering
    marginRight: -32,
  },

  interestList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
})

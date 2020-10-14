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

  interestContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  
  addInterestsIcon: {
    width: 32,
    height: 32,
    flex: 1,
    flexGrow: 0,
    flexShrink: 0,
  },
  
  interestList: {
    flexShrink: 1,
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -6,
  },
})

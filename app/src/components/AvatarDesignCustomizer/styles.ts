import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  avatarDesignForm: {
    flexGrow: 1,
    borderTopWidth: 2,
    borderTopColor: '#f0f0f0',
  },

  pieces: {
    padding: 12,
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  piece: {
    margin: 4,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#f0f0f0',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  pieceBacker: {
    position: 'absolute',
    backgroundColor: '#e0e0e0',
    borderRadius: 1000,
  },

  modifierPanel: {
    borderTopWidth: 2,
    borderTopColor: '#f0f0f0',
  },

  modifierPanelInner: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 2,
  },

  tabPanel: {
    borderTopWidth: 2,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fcfcfc',
  },
})

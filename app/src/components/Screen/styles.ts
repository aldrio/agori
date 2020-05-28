import { StyleSheet } from 'react-native'
import { agoriTheme } from 'utils/theme'

export default StyleSheet.create({
  topNavigation: {
    backgroundColor: agoriTheme['color-primary-100'],
  },
  innerScreen: {
    flex: 1,
  },
  errorBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBox: {
    borderWidth: 2,
    borderRadius: 4,
    borderStyle: 'dashed',
    borderColor: agoriTheme['color-danger-300'],
    padding: 8,
    paddingVertical: 16,
  },
})

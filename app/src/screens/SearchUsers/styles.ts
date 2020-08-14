import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  innerList: {
    backgroundColor: '#fafafa',
    padding: 8,
    flexGrow: 1,
  },

  listColumnWrapper: {
    alignItems: 'stretch',
  },

  item: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: '#dedede',
    borderWidth: 1,
    padding: 12,
    borderRadius: 2,
    alignItems: 'center',
  },

  userInfo: {
    alignSelf: 'stretch',
    flexGrow: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
})

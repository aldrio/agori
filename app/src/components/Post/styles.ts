import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  post: {
    marginVertical: 12,
  },
  postBorder: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingBottom: 24,
    marginBottom: 24,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 8,
    flexGrow: 1,
  },
  displayNameText: {
    color: '#444',
    fontWeight: 'bold',
  },
  createdAtText: {
    color: '#aaa',
  },
  updatedAtText: {
    fontStyle: 'italic',
    color: '#aaa',
  },
  headerMore: {
    alignSelf: 'flex-start',
    flexShrink: 0,
    flexDirection: 'row',
  },

  content: {
    marginLeft: 8,
    marginBottom: 12,
  },
  contentText: {
    color: '#444',
  },

  children: {
    paddingLeft: 24,
    borderLeftColor: '#eee',
    borderLeftWidth: 1,
  },

  iconButton: {
    width: 12,
    height: 12,
  },

  sendButton: {
    marginHorizontal: 4,
    borderRadius: 50,
  },

  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  replyButtonIcon: {
    width: 14,
    height: 14,
    tintColor: '#ccc',
    marginHorizontal: 8,
  },
  replyButtonText: {
    color: '#ccc',
    fontWeight: 'bold',
  },
})

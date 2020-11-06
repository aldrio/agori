import { StyleSheet, Dimensions } from 'react-native'

const Window = Dimensions.get('window')

export default StyleSheet.create({
  message: {
    padding: 12,
    paddingHorizontal: 24,
    position: 'relative',
  },

  messageBubble: {
    minWidth: 100,
    maxWidth: Window.width - 100,
    padding: 12,
    borderRadius: 6,
  },

  theirMessageBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#4A7DFF',
  },

  myMessageBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#B3BCD3',
  },

  messageBubbleThingy: {
    position: 'absolute',
    width: 16,
    height: 16,
    transform: [{ rotate: '45deg' }],
    backgroundColor: 'orange',
    bottom: 24,
  },

  theirMessageBubbleThingy: {
    left: 18,
    backgroundColor: '#4A7DFF',
  },

  myMessageBubbleThingy: {
    right: 18,
    backgroundColor: '#B3BCD3',
  },

  messageText: {
    color: 'white',
  },

  theirMessageText: {},

  myMessageText: {},
})

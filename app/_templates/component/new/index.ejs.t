---
to: src/components/<%= h.inflection.camelize(name, false) %>/index.tsx
---
import React from 'react'
import styles from './styles'
import { View } from 'react-native'
import { Text } from '@ui-kitten/components'

export type <%= h.inflection.camelize(name, false) %>Props = {}
export const <%= h.inflection.camelize(name, false) %>: React.FC<<%= h.inflection.camelize(name, false) %>Props> = () => {
  return (
    <View style={styles.<%= h.inflection.camelize(name, true) %>}>
      <Text><%= h.inflection.camelize(name, false) %></Text>
    </View>
  )
}

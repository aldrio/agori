---
to: src/components/<%= h.inflection.camelize(name, false) %>/styles.ts
---
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  <%= h.inflection.camelize(name, true) %>: {},
})

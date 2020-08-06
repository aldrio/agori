import React from 'react'
import styles from './styles'
import { View } from 'react-native'

export type FormItemProps = {}

export const FormItem: React.FC<FormItemProps> = ({ children }) => {
  return <View style={styles.formItem}>{children}</View>
}

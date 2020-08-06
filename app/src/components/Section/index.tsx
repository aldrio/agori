import React from 'react'
import styles from './styles'
import { View } from 'react-native'
import { Text, Divider } from '@ui-kitten/components'

export type SectionProps = {
  title: string
  topDivider?: boolean
  bottomDivider?: boolean
}

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  topDivider = true,
  bottomDivider = true,
}) => {
  return (
    <View>
      {topDivider && <Divider />}
      <View style={styles.section}>
        <Text category="s1" appearance="hint">
          {title}
        </Text>
        <View style={styles.inner}>{children}</View>
      </View>
      {bottomDivider && <Divider />}
    </View>
  )
}

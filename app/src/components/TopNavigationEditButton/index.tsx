import React from 'react'
import styles from './styles'
import { TopNavigationAction, Icon } from '@ui-kitten/components'

const EditIcon = (props: any) => <Icon {...props} name="edit" />

export type TopNavigationEditButtonProps = {
  onPress?: () => void
  disabled?: boolean
}
export const TopNavigationEditButton: React.FC<TopNavigationEditButtonProps> = ({
  onPress,
  disabled = false,
}) => {
  return (
    <TopNavigationAction
      disabled={disabled}
      icon={EditIcon}
      onPress={onPress}
    />
  )
}

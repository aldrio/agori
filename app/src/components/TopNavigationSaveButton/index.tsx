import React from 'react'
import styles from './styles'
import { TopNavigationAction, Icon, Spinner } from '@ui-kitten/components'

const LoadingIcon = (props: any) => <Spinner {...props} size="small" />
const SaveIcon = (props: any) => <Icon {...props} name="save" />

export type TopNavigationSaveButtonProps = {
  onPress?: () => void
  loading?: boolean
  disabled?: boolean
}
export const TopNavigationSaveButton: React.FC<TopNavigationSaveButtonProps> = ({
  onPress,
  loading = false,
  disabled = false,
}) => {
  return (
    <TopNavigationAction
      disabled={loading || disabled}
      icon={loading ? LoadingIcon : SaveIcon}
      onPress={onPress}
    />
  )
}

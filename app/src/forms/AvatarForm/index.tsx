import React, { useState, useEffect } from 'react'
import styles from './styles'
import {
  View,
  useWindowDimensions,
  ToastAndroid,
  Alert,
  BackHandler,
} from 'react-native'
import { useTheme } from '@ui-kitten/components'
import { useMutation } from '@apollo/react-hooks'
import {
  EditAvatarMutation,
  EditAvatarMutationVariables,
  AvatarFormFragment,
} from 'types/apollo-schema-types'
import gql from 'graphql-tag'
import { AvatarDesignData, AvatarStyle, getRandomAvatarDesignData } from 'avatars'
import { AvatarDesign } from 'components/AvatarDesign'
import { AvatarDesginCustomizer } from 'components/AvatarDesignCustomizer'
import { BlackPortal } from 'react-native-portal'
import { EditAvatarScreenName } from 'screens/EditAvatar'
import { TopNavigationSaveButton } from 'components/TopNavigationSaveButton'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from 'App'

export const AvatarFormGqlFragment = gql`
  fragment AvatarFormFragment on User {
    id
    avatarData
    avatarThumbnailUrl
  }
`

export type AvatarFormProps = {
  data: AvatarFormFragment
  onCompleted?: (data: AvatarFormFragment) => void
}

export const AvatarForm: React.FC<AvatarFormProps> = ({
  data,
  onCompleted,
}) => {
  const [design, setDesign] = useState(() => {
    if (data.avatarData) {
      return JSON.parse(data.avatarData) as AvatarDesignData
    } else {
      return getRandomAvatarDesignData()
    }
  })
  const [isDirty, setIsDirty] = useState(false)

  const [editAvatar, { loading }] = useMutation<
    EditAvatarMutation,
    EditAvatarMutationVariables
  >(
    gql`
      mutation EditAvatarMutation($avatarData: String!) {
        editMe(editUser: { avatarData: $avatarData }) {
          id
          ...AvatarFormFragment
        }
      }
      ${AvatarFormGqlFragment}
    `,
    {
      onCompleted: (data) => {
        onCompleted && onCompleted(data.editMe)
        setIsDirty(false)
      },
      onError: (error) => ToastAndroid.show(error.message, ToastAndroid.SHORT),
    }
  )

  const save = async () => {
    // Run mutation with json encoded avatar
    const encoded = JSON.stringify(design)
    await editAvatar({ variables: { avatarData: encoded } })
  }

  const theme = useTheme()

  const { width, height } = useWindowDimensions()
  const size = Math.min(height - 450, width * 0.75)

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  useEffect(() => {
    if (!isDirty) {
      return
    }

    const backAction = () => {
      Alert.alert(
        'You have unsaved changes!',
        'Are you sure you want to go back?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'YES', onPress: () => navigation.goBack() },
        ]
      )
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => backHandler.remove()
  }, [isDirty, navigation])

  return (
    <View style={styles.avatarForm}>
      <BlackPortal name={EditAvatarScreenName}>
        <TopNavigationSaveButton loading={loading} onPress={save} />
      </BlackPortal>
      <View
        style={[styles.avatar, { backgroundColor: theme['color-primary-100'] }]}
      >
        <AvatarDesign size={size} design={design} avatarStyle={AvatarStyle.Transparent} />
      </View>
      <AvatarDesginCustomizer
        design={design}
        onDesignChange={(d) => {
          setIsDirty(true)
          setDesign(d)
        }}
      />
    </View>
  )
}

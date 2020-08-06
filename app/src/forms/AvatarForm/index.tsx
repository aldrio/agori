import React, { useState } from 'react'
import styles from './styles'
import { View, useWindowDimensions } from 'react-native'
import { useTheme } from '@ui-kitten/components'
import { useMutation } from '@apollo/react-hooks'
import {
  EditAvatarMutation,
  EditAvatarMutationVariables,
  AvatarFormFragment,
} from 'types/apollo-schema-types'
import gql from 'graphql-tag'
import {
  AvatarDesignData,
  getRandomAvatarDesignData,
} from 'components/AvatarDesign/pieces'
import { AvatarDesign } from 'components/AvatarDesign'
import { AvatarDesginCustomizer } from 'components/AvatarDesignCustomizer'
import { BlackPortal } from 'react-native-portal'
import { EditAvatarScreenName } from 'screens/EditAvatar'
import { TopNavigationSaveButton } from 'components/TopNavigationSaveButton'

export const AvatarFormGqlFragment = gql`
  fragment AvatarFormFragment on User {
    id
    avatarData
  }
`

export type AvatarFormProps = {
  data: AvatarFormFragment
}

export const AvatarForm: React.FC<AvatarFormProps> = ({ data }) => {
  const [design, setDesign] = useState(() => {
    if (data.avatarData) {
      return JSON.parse(data.avatarData) as AvatarDesignData
    } else {
      return getRandomAvatarDesignData()
    }
  })

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
    `
  )

  const save = () => {
    // Run mutation with json encoded avatar
    const encoded = JSON.stringify(design)
    editAvatar({ variables: { avatarData: encoded } })
  }

  const theme = useTheme()

  const { width, height } = useWindowDimensions()
  const size = Math.min(height - 450, width * 0.75)

  return (
    <View style={styles.avatarForm}>
      <BlackPortal name={EditAvatarScreenName}>
        <TopNavigationSaveButton loading={loading} onPress={save} />
      </BlackPortal>
      <View
        style={[styles.avatar, { backgroundColor: theme['color-primary-100'] }]}
      >
        <AvatarDesign size={size} design={design} />
      </View>
      <AvatarDesginCustomizer design={design} onDesignChange={setDesign} />
    </View>
  )
}

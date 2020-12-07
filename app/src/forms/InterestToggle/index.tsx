import React, { useState } from 'react'
import styles from './styles'
import { Alert } from 'react-native'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/client'
import {
  InterestsToggleQuery,
  AddInterestMutation,
  AddInterestMutationVariables,
  RemoveInterestMutation,
  RemoveInterestMutationVariables,
  InterestToggleFragment,
} from 'types/apollo-schema-types'
import { Chip } from 'components/Chip'

/**
 * Fragment of data needed for the interest
 *
 * Useful for loading and caching all the data at once
 */
export const InterestToggleGqlFragment = gql`
  fragment InterestToggleFragment on Interest {
    id
    label
    description
  }
`

export type InterestToggleProps = {
  interest: InterestToggleFragment
}
export const InterestToggle: React.FC<InterestToggleProps> = ({ interest }) => {
  const { data, ...interestRes } = useQuery<InterestsToggleQuery>(
    gql`
      query InterestsToggleQuery {
        me {
          id
          interests {
            id
          }
        }
      }
    `,
    { partialRefetch: true }
  )

  const [addInterest, addInterestRes] = useMutation<
    AddInterestMutation,
    AddInterestMutationVariables
  >(
    gql`
      mutation AddInterestMutation($interestId: ID!) {
        addInterest(interestId: $interestId) {
          id
          interests {
            id
          }
        }
      }
    `,
    { variables: { interestId: interest.id } }
  )
  const [removeInterest, removeInterestRes] = useMutation<
    RemoveInterestMutation,
    RemoveInterestMutationVariables
  >(
    gql`
      mutation RemoveInterestMutation($interestId: ID!) {
        removeInterest(interestId: $interestId) {
          id
          interests {
            id
          }
        }
      }
    `,
    { variables: { interestId: interest.id } }
  )

  const loading =
    interestRes.loading || addInterestRes.loading || removeInterestRes.loading

  const isActive = !!data?.me.interests.find((i) => i.id === interest.id)
  const [expectIsActive, setExpectIsActive] = useState(isActive)
  const showActive = loading ? expectIsActive : isActive

  return (
    <Chip
      onPress={async () => {
        setExpectIsActive(!showActive)
        if (showActive) {
          await removeInterest()
        } else {
          await addInterest()
        }
      }}
      onLongPress={() => Alert.alert(interest.description || '')}
      label={interest.label}
      active={showActive}
    />
  )
}

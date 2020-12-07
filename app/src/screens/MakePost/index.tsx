import React from 'react'
import styles from './styles'
import { RootStackParamList } from 'App'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Screen } from 'components/Screen'
import { Text } from '@ui-kitten/components'
import { PostForm } from 'forms/PostForm'

export const MakePostScreenName = 'MakePostScreen'
export type MakePostScreenParams = {
  interestId: string
}
type MakePostScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof MakePostScreenName
>
type MakePostScreenRouteProp = RouteProp<
  RootStackParamList,
  typeof MakePostScreenName
>

export type MakePostProps = {
  navigation: MakePostScreenNavigationProp
  route: MakePostScreenRouteProp
}
/**
 * Page for creating a post on an interest board
 */
export const MakePostScreen: React.FC<MakePostProps> = ({
  route,
  navigation,
}) => {
  const { interestId } = route.params
  return (
    <Screen title="MakePost" back optionsKey={MakePostScreenName}>
      <Text>
        Posting to <Text style={{ fontWeight: 'bold' }}>asdasdf</Text>
      </Text>
      <PostForm
        interestId={interestId}
        onCompleted={(_post) => {
          navigation.navigate('InterestBoardScreen', {
            interestId,
          })
        }}
      />
    </Screen>
  )
}

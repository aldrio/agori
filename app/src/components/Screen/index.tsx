import React, { ReactElement } from 'react'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components'
import { RenderProp } from '@ui-kitten/components/devsupport'
import {
  ImageProps,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  View,
  StatusBar,
} from 'react-native'
import { agoriTheme } from 'utils/theme'
import { WhitePortal } from 'react-native-portal'

const CloseIcon = (props?: Partial<ImageProps>): ReactElement => (
  <Icon {...props} name="close" />
)
const BackIcon = (props?: Partial<ImageProps>): ReactElement => (
  <Icon {...props} name="arrow-back-outline" />
)

export type ScreenProps = {
  title: string
  subTitle?: string
  back?: boolean
  close?: boolean
  padding?: boolean
  loading?: boolean
  error?: string
  renderAccessoryRight?: RenderProp
  onRefresh?: () => void
  hideAccountAction?: boolean
  noScroll?: boolean

  /**
   * A key to consume with a portal for more options
   *
   * Will cause renderAccessoryRight to be ignored when something is rendered through the portal
   */
  optionsKey?: string
}
export const Screen: React.FC<ScreenProps> = ({
  children,
  title,
  subTitle,
  back,
  close,
  loading,
  error,
  padding = true,
  renderAccessoryRight,
  onRefresh,
  noScroll = false,
  optionsKey,
}) => {
  const navigation = useNavigation()

  const renderAccessoryLeft = () => {
    if (!back && !close) {
      return <TopNavigationAction />
    }

    return (
      <TopNavigationAction
        icon={back ? BackIcon : CloseIcon}
        onPress={() => {
          navigation.goBack()
        }}
      />
    )
  }

  let body
  if (error) {
    body = (
      <View style={styles.errorBox}>
        <Text status="danger" category="h5">
          Error!
        </Text>
        <Text status="danger">{error}</Text>
      </View>
    )
  } else {
    body = children
  }

  body = (
    <Layout style={[styles.innerScreen, padding && { padding: 16 }]}>
      {body}
    </Layout>
  )

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={agoriTheme['color-primary-100']}
        barStyle="dark-content"
      />
      <TopNavigation
        title={title}
        alignment="center"
        style={styles.topNavigation}
        subtitle={subTitle}
        accessoryLeft={renderAccessoryLeft}
        accessoryRight={() => {
          if (optionsKey) {
            return (
              <WhitePortal name={optionsKey}>
                {renderAccessoryRight && renderAccessoryRight()}
              </WhitePortal>
            )
          } else {
            return <>{renderAccessoryRight && renderAccessoryRight()}</>
          }
        }}
      />
      <Divider />
      {noScroll ? (
        body
      ) : (
        <ScrollView
          style={{ flexGrow: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={loading === true}
              onRefresh={onRefresh}
            />
          }
        >
          {body}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

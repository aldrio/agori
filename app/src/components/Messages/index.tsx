import React from 'react'
import styles from './styles'
import { SectionList } from 'react-native'
import { MessageFragment } from 'types/apollo-schema-types'
import { Message } from './Message'
import { Layout, Text } from '@ui-kitten/components'
import dayjs from 'dayjs'

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

export type MessagesProps = {
  myId: string
  messages: MessageFragment[]
}
export const Messages: React.FC<MessagesProps> = ({ myId, messages }) => {
  // Split messages into groups where the time between them is less than some threshold
  const messageGroups: {
    starts: dayjs.Dayjs
    ends: dayjs.Dayjs
    data: MessageFragment[]
  }[] = []
  messages.forEach((m) => {
    const previousStart =
      messageGroups[messageGroups.length - 1]?.starts || dayjs(0)
    const previousEnd =
      messageGroups[messageGroups.length - 1]?.ends || dayjs(0)

    const current = dayjs(m.createdAt)

    let shouldBreak = false
    // Determine if there should be a break
    // Breaks should be triggered if the day changes
    if (!current.isSame(previousEnd, 'day')) {
      shouldBreak = true
    }

    // Or if more than an hour passed
    if (previousStart.diff(current, 'hour') >= 1) {
      shouldBreak = true
    }

    if (shouldBreak) {
      messageGroups.push({
        starts: current,
        ends: current,
        data: [],
      })
    }

    const group = messageGroups[messageGroups.length - 1]
    group.data.push(m)
    group.ends = current
  })

  return (
    <Layout level="2" style={styles.messages}>
      <SectionList
        style={{ flexGrow: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        inverted
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="always"
        sections={messageGroups}
        renderSectionFooter={({ section }) => (
          <Text style={styles.timeSeparator}>
            {(dayjs(section.data[0].createdAt) as any).fromNow()}
          </Text>
        )}
        renderItem={({ item: message }) => (
          <Message myId={myId} message={message} />
        )}
        keyExtractor={(item) => item.id}
      />
    </Layout>
  )
}

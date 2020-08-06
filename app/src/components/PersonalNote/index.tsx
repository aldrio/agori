import React, { useState, useEffect } from 'react'
import styles from './styles'
import { View, AsyncStorage } from 'react-native'
import { Input } from '@ui-kitten/components'

export type PersonalNoteProps = {
  id: string
}

/**
 * Component for leaving a personal note. Backed locally and identified by an ID
 */
export const PersonalNote: React.FC<PersonalNoteProps> = ({ id }) => {
  const pid = `personal-note:${id}`

  const [note, setNote] = useState('')

  useEffect(() => {
    // Load note from storage when getting a new id
    ;(async () => {
      setNote((await AsyncStorage.getItem(pid)) || '')
    })()
  }, [pid])

  const onChangeNote = async (text: string) => {
    setNote(text)
    await AsyncStorage.setItem(pid, text)
  }

  return (
    <View style={styles.personalNote}>
      <Input value={note} onChangeText={onChangeNote} />
    </View>
  )
}

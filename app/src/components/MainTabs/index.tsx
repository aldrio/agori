import React from 'react'
import styles from './styles'
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from '@ui-kitten/components'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'

export type MainTabsProps = BottomTabBarProps
export const MainTabs: React.FC<MainTabsProps> = ({ navigation, state }) => {
  return (
    <BottomNavigation
      style={styles.mainTabs}
      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}
    >
      <BottomNavigationTab icon={(props) => <Icon name="home" {...props} />} />
      <BottomNavigationTab
        icon={(props) => <Icon name="search" {...props} />}
      />
      <BottomNavigationTab
        icon={(props) => <Icon name="person" {...props} />}
      />
    </BottomNavigation>
  )
}

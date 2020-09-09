import { registerRootComponent } from 'expo'
import 'mobx-react-lite/batchingForReactNative'
import 'utils/monitoring'

import { App } from 'App'

registerRootComponent(App)

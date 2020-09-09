import Config from 'utils/config'
import * as Sentry from 'sentry-expo'
import Constants from 'expo-constants'

Sentry.init({
  dsn: Config.sentryDsn,
  enableInExpoDevelopment: false,
  debug: false,
  environment: Constants.manifest.releaseChannel || 'development',
})

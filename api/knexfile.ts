import dotenv from 'dotenv'
dotenv.config()

import Config from './src/utils/config'
export = Config.dbConnection

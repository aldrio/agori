import 'ts-node/register'
import 'tsconfig-paths/register'
import 'reflect-metadata'

import dotenv from 'dotenv'
dotenv.config()

import Config from './src/utils/config'
export = Config.dbConnection

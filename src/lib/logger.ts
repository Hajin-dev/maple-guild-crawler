import {createLogger,format,transports } from 'winston'
import path from 'path'
import appRootPath from 'app-root-path'
const appRoot = appRootPath.path
const logger = createLogger({
    level:'info',
    format: format.combine(
        format.timestamp({
            format:path.join(appRoot,'logs')
        }),
        format.errors({stack:true}),
        format.splat(),
        format.json()
    ),
    defaultMeta:{service:'guild-lvExp-logger'},
    transports:[
        new transports.File({ filename: 'quick-start-error.log', level: 'error' }),
        new transports.File({ filename: 'quick-start-combined.log' })
    ]
})
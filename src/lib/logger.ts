import {createLogger,format,transports } from 'winston'
import path from 'path'
import winstonDaily from 'winston-daily-rotate-file'
import os from 'os'
const logFormat = format.printf(info=>{
    return `[${info.timestamp}] ${info.level}: ${info.message}`
})
export const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.errors({stack:true}),
        logFormat,
    ),
    defaultMeta:{service:'guild-lvExp-logger'},
    transports:[
        new transports.Console(),
        new winstonDaily({
            level:'info',
            datePattern:'YYMMDD',
            dirname:path.join(os.homedir(),'.logs','info'),
            filename:`%DATE%.log`,
            maxFiles: 30,
            zippedArchive:true
        }),
        new winstonDaily({
            level:'error',
            datePattern:'YYMMDD',
            dirname:path.join(os.homedir(),'.logs','error'),
            filename:`%DATE%.log`,
            zippedArchive:true
        })
    ]
})
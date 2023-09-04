import 'dotenv/config'
import { logger } from '../lib/logger.js'
// logger.log('info',JSON.stringify(process.env,null,2))

if(!process.env.GUILD_URLS){
    logger.error('.dev does not loaded!')
}
else{
    logger.info('.dev Env variables are loaded succesfully.')
}
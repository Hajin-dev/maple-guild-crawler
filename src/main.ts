import cron from 'node-cron'
import update from './lib/update.js'

cron.schedule('0 6 * * *',async ()=>{await update()},{timezone:"Asia/Seoul"})
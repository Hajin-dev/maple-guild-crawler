import {$Enums, PrismaClient } from "@prisma/client"
import {getUser,memberInfo} from './getUser.js'
import { logger } from "./logger.js"
const prisma = new PrismaClient()
async function main() {
    getUser().then(async _webDatas=>{
        _webDatas.forEach(async v=>{
            const result = await prisma.character.create({
                data:
                    {charName:v.charName!,
                    charImage:v.image!,
                    character_status:$Enums.CHARSTATUS.UNREGISTERED_OR_RENAMED,
                    guild:$Enums.GUILD.MAIN,
                    char_exp_history:{
                        create:{
                            lv:Number(v.lv),
                            exp:Number(v.exp),
                            date:new Date()
                        }
                    }}
            })
            logger.log('info','logged: '+result.charName,)
        })})
}


main()
    .then(async () => {
    await prisma.$disconnect()
})
.catch(async (e) => {
    logger.error(e)
    await prisma.$disconnect()
    process.exit(1)
})
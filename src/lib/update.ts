import {$Enums, PrismaClient } from "@prisma/client"
import {getUser} from './getUser.js'
import { logger } from "./logger.js"
const prisma = new PrismaClient()
const guildURLArray = process.env.GUILD_URLS.split(' ')
async function do_update(url:string,guildType:$Enums.GUILD){
    getUser(url).then(
        async _WebDatas=>{ //getUser lib으로 홈페이지 내 길드 캐릭터 불러옴
       for (const webData of _WebDatas){
        const result = await prisma.character.upsert({
            where:{
                charName:webData.charName
            },
            update:{
                char_exp_history:{
                    create:{
                        lv:Number(webData.lv),
                        exp:Number(webData.exp),
                        date:new Date(),
                    }
                }
            },
            create:{
                charName:webData.charName!,
                charImage:webData.image||"https://ssl.nexon.com/s2/game/maplestory/renewal/common/no_char_img_180.png",
                character_status:$Enums.CHARSTATUS.UNREGISTERED_OR_RENAMED,
                guild:guildType,
                char_exp_history:{

                    create:{
                        lv:Number(webData.lv),
                        exp:Number(webData.exp),
                        date:new Date()
                    }
                }
            }
        })
        logger.info(result.charName+" in "+guildType)
       }
    })
}
async function main(){
    const guildArr:$Enums.GUILD[] =["MAIN","SUB1","SUB2","SUB3","SUB4"] 
    const guildList:{url:string,guild:$Enums.GUILD}[]=[]
    for(const i in guildURLArray){
        guildList.push({
            url:guildURLArray[i],
            guild:guildArr[i]
        })
    }
    guildList.map(async (value)=>(
        await do_update(value.url,value.guild)
    ))
    
}

export default async function update(){
    main().then(async ()=>{
        await prisma.$disconnect()}
    ).catch(async (e) => {
        logger.error(e)
        await prisma.$disconnect()
        process.exit(1)
      })
}

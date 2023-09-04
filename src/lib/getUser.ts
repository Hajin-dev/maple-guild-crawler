import got from 'got'
import { parse } from 'node-html-parser';
import type {HTMLElement} from 'node-html-parser'
import { logger } from './logger.js';
import { loggers } from 'winston';
const detectRole = (raw:string|undefined):"MASTER"|"MANAGER"|"MEMBER"|undefined=>{
    if(raw=="길드원") return "MEMBER"
    else if (raw=="부마스터") return "MANAGER"
    else if (raw=="마스터")return "MASTER"
    else return undefined
}
const parseMember = (e:HTMLElement):memberInfo=>{
    const image = e.querySelector('td.left>span.char_img>img') ? e.querySelector('td.left>span.char_img>img')?.getAttribute('src') : "https://ssl.nexon.com/s2/game/maplestory/renewal/common/no_char_img_180.png"
    const charName = e.querySelector('td.left>span.char_img>img') ? e.querySelector('td.left>span.char_img>img')?.getAttribute('alt'):"error!"
    const job = e.querySelector('td.left>dl>dd')?.innerText ? e.querySelector('td.left>dl>dd')?.innerText :"error!"
    const role = detectRole(e.querySelector('td:nth-child(1)')?.innerText)
    const lv = Number(e.querySelector('td:nth-child(3)')?.innerText.slice(-3))
    const exp = Number(e.querySelector('td:nth-child(4)')?.innerText.replaceAll(',', ''))
    return {image,charName,job,role,lv,exp}
}
export type memberInfo = {
    role: "MASTER"|"MANAGER"|"MEMBER"|undefined,
    job:string|undefined,
    lv:string|number|undefined,
    exp:string|number|undefined,
    charName:string|undefined,
    image:string|undefined
}
function sleep(ms:number) {
    return new Promise((r) => setTimeout(r, ms));
}


async function pageParse(url:string):Promise<{ body: HTMLElement | null; nextUrl: string | undefined; }>{
    await sleep(1000)
    loggers.log('Parsring: '+url)
    const data = await got.get(url)
    const root = parse(data.body)
    const body = root.querySelector('table.rank_table>tbody')
    const nextUrl = (root.querySelector('span.cm_next>a')?.attributes['href'])?'https://maplestory.nexon.com'+(root.querySelector('span.cm_next>a')?.attributes['href']):undefined
    return {body,nextUrl}
}


export async function getUser(guildURl='https://maplestory.nexon.com/Common/Guild?gid=36662&wid=45'):Promise<memberInfo[]>{
    let url:string|undefined = guildURl
    const rawPages:(HTMLElement | null)[] = []
    const memebers:memberInfo[]=[]
    do{
        const {body,nextUrl}=await pageParse(url)
        url=nextUrl
        rawPages.push(body)
    }while(url)
    for (const rawPage of rawPages){
        const tr_list = rawPage?.querySelectorAll('tr')
        for (const tr of tr_list!){
            memebers.push(parseMember(tr))
        }
    }
    return memebers
}
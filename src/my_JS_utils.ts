/*
    Path + Filename: src/openJson.ts
*/

import fs from 'fs'

export function openJson<JsonType>(filename : string) : JsonType {
    const rawContent = fs.readFileSync(filename,{encoding: 'utf8', flag: 'r'})
    return JSON.parse(rawContent)
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

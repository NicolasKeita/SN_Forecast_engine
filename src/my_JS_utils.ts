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

/* Slightly diff from orinal :
*   If the code executions takes more than the period,
*   it waits for the code execution to end
*   before executing it again.
 */
export async function mySetInterval(code: { (): Promise<void>; (): void }, period: number) {
    const resetTime = Date.now() + period
    await code()
    setTimeout(mySetInterval, Math.max(0, resetTime - Date.now()), code, period)
}

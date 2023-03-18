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

export class LimitsRate {
    private readonly _amountAllowed: number
    private readonly _period : number
    private _counter : number
    private _resetTime : number

    constructor(amountAllowed : number, period : number) {
        this._amountAllowed = amountAllowed
        this._period = period // in miliseconds
        this._counter = 0
        this._resetTime = -1
    }
    async patientlyExec(code, ...args) {
        this._counter += 1
        if (Date.now() > this._resetTime) {
            this._resetTime = Date.now() + this._period
            this._counter = 1
        } else {
            if (this._counter > this._amountAllowed) {
                console.error(`Maximun amount of request for FetchRank is being reached, waiting ${(this._resetTime - Date.now()) / 1000} seconds`)
                await sleep(this._resetTime - Date.now())
            }
        }
        return code(...args)
    }
}
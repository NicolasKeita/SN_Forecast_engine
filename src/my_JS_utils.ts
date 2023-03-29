/*
    Path + Filename: src/openJson.ts
*/

import fs from 'fs'
import * as util from 'util'
import {log} from 'util'

export function openJson<JsonType>(filename : string) : JsonType {
    const rawContent = fs.readFileSync(filename,{encoding: 'utf8', flag: 'r'})
    return JSON.parse(rawContent)
}

export function sleep(ms : number) {
    if (ms > 0) {
        console.log(`Sleeping ${ms}`)
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/* Slightly diff from original :
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
    private readonly _period: number
    private _counter: number
    private _resetTime: number

    constructor(amountAllowed: number, period: number) {
        this._amountAllowed = amountAllowed
        this._period = period // in milliseconds
        this._counter = 0
        this._resetTime = -1
    }

    necessaryWaitingTime() : number {
        const dateNow = Date.now()
        return (dateNow <= this._resetTime && this._counter >= this._amountAllowed) ? this._resetTime - dateNow : 0
    }

    incrementCounter() {
        if (Date.now() > this._resetTime)
            this._resetLimits()
        this._counter += 1
        //console.log(`cOUNTER ${this._counter} perdiod : ${this._period}`)
    }

    private _resetLimits() {
        //console.log(`RESET ${this._period}`)
        this._resetTime = Date.now() + this._period
        this._counter = 0
    }
}

export function logToFile(any : unknown, filename : string, displayInConsole = false) {
    let logLine = util.inspect(any)
    const date = new Date();
    const formattedDate = date.toLocaleString('en-US', { timeZone: 'Europe/Berlin'});
    logLine = formattedDate + ' || ' + logLine
    if (displayInConsole)
        console.log(logLine)
    fs.writeFileSync(filename, logLine, {flag: 'a'})
}



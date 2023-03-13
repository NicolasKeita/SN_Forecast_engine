/*
    Path + Filename: src/index.ts
*/

import fs from 'fs'

import {fetchMatchHistory} from './fetchMatch.js'

let matchInfos = await fetchMatchHistory('EUW1_6313527480', 'euw1')

console.log("DISPLAYING")
console.log(matchInfos)

type AllForecastType = {
    amount : number
}

function isAllForecastType(forecast : any) : forecast is AllForecastType {
    return (forecast as AllForecastType).amount !== undefined
}

const all_forecast : AllForecastType = {
    amount : 0,
}

const forecast = matchInfos.info.gameVersion

saveForecastToJson(forecast)

function saveForecastToJson(forecast) {
    const allForecastString : string = fs.readFileSync('all_forecast.json', {encoding: 'utf8', flag: 'r'})
    const allForecast : AllForecastType = JSON.parse(allForecastString)
    if (!isAllForecastType(allForecast)) {
        console.error("Not a forecast")
        return
    }
    allForecast.amount += 1
    fs.writeFileSync('all_forecast.json', JSON.stringify(allForecast))
}
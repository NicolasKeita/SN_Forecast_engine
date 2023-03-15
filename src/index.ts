/*
    Path + Filename: src/index.ts
*/

import fs from 'fs'

import {fetchMatchHistory} from './fetchMatch.js'
import {FetchMatchHistoryType, Participant} from './fetchMatchHistory_type.js'
import {computeWinPercentage} from './computeWinrateBetweenTwoTeams.js'

// const matchId = 'EUW1_6313527480'

const matchId = 'EUW1_6316539626'
const region = 'euw1'

enum WinningTeam {
    TeamOne,
    TeamTwo
}

type Forecast = {
    matchId : string,
    region : string,
    winner : WinningTeam,
    teams : number[][]
    winPercentage : number,
}

function splitParticipantsIntoTeams(participants : Participant[]) : number[][] {
    const teamOneId = participants[0].teamId
    const teamOne : number[] = []
    const teamTwo : number[] = []

    for (const participant of participants) {
        if (participant.teamId == teamOneId) {
            teamOne.push(participant.championId)
        } else {
            teamTwo.push(participant.championId)
        }

    }
    return [teamOne, teamTwo]
}

function createForecast(matchId : string, region : string,
                        matchInfos : FetchMatchHistoryType) : Forecast {
    const [teamOne, teamTwo] = splitParticipantsIntoTeams(matchInfos.info.participants)
    return {
        matchId: matchId,
        region: region,
        winner: WinningTeam.TeamOne,
        teams: [teamOne, teamTwo],
        winPercentage: computeWinPercentage(teamOne, teamTwo)
    }
}

type AllForecastType = {
    amount : number
}

function isAllForecastType(forecast : any) : forecast is AllForecastType {
    return (forecast as AllForecastType).amount !== undefined
}

function saveForecastToJson(forecast) : number {
    const allForecastString : string = fs.readFileSync('all_forecast.json', {encoding: 'utf8', flag: 'r'})
    const allForecast : AllForecastType = JSON.parse(allForecastString)
    if (!isAllForecastType(allForecast)) {
        console.error("Not a forecast")
        return -1
    }
    allForecast.amount += 1
    fs.writeFileSync('all_forecast.json', JSON.stringify(allForecast))
    return allForecast.amount
}

async function my_main() {
    let matchInfos = await fetchMatchHistory(matchId, region)
    const forecast = createForecast(matchId, region, matchInfos)
    console.log(forecast.winPercentage)
    const totalAmountOfForecast = saveForecastToJson(forecast)
    console.log(totalAmountOfForecast)
}

await my_main()

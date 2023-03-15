/*
    Path + Filename: src/index.ts
*/

import fs from 'fs'

import {fetchMatchHistory} from './fetchMatch.js'
import {FetchMatchHistoryType, Participant} from './fetchMatchHistory_type.js'
import {computeWinPercentage} from './computeWinrateBetweenTwoTeams.js'
import {openJson} from './openJson.js'

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

type AccumulatedForecasts = {
    amount : number,
    latestMatchId : string,
    totalCorrectForecast : number,
    correctForecastPercentage : number
}

function accumulateForecast(accumulatedForecasts : AccumulatedForecasts, forecast : Forecast) {
    accumulatedForecasts.amount += 1
    accumulatedForecasts.latestMatchId = matchId
    if ((forecast.winPercentage > 50 && forecast.winner == WinningTeam.TeamOne)
        || (forecast.winPercentage < 50 && forecast.winner == WinningTeam.TeamTwo))
        accumulatedForecasts.totalCorrectForecast += 1
    accumulatedForecasts.correctForecastPercentage =
        (accumulatedForecasts.totalCorrectForecast / accumulatedForecasts.amount) * 100
}

async function my_main() {
    const matchInfos = await fetchMatchHistory(matchId, region)
    const forecast = createForecast(matchId, region, matchInfos)
    const accumulatedForecasts = openJson<AccumulatedForecasts>('accumulatedForecasts.json')
    accumulateForecast(accumulatedForecasts, forecast)
    fs.writeFileSync('accumulatedForecasts.json', JSON.stringify(accumulatedForecasts, null, 3))
}

await my_main()

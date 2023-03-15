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

type AccumulatedForecasts = {
    amount : number,
    latestMatchId : string,
    totalCorrectForecast : number,
    correctForecastPercentage : number
}

function splitParticipantsIntoTeams(participants : Participant[]) : number[][] {
    const teamOne : number[] = []
    const teamTwo : number[] = []

    for (const participant of participants)
        if (participant.teamId == participants[0].teamId)
            teamOne.push(participant.championId)
        else
            teamTwo.push(participant.championId)
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

function accumulateForecast(accumulatedForecasts : AccumulatedForecasts, forecast : Forecast) {
    accumulatedForecasts.amount += 1
    accumulatedForecasts.latestMatchId = forecast.matchId
    if ((forecast.winPercentage > 50 && forecast.winner == WinningTeam.TeamOne)
        || (forecast.winPercentage < 50 && forecast.winner == WinningTeam.TeamTwo))
        accumulatedForecasts.totalCorrectForecast += 1
    accumulatedForecasts.correctForecastPercentage =
        (accumulatedForecasts.totalCorrectForecast / accumulatedForecasts.amount) * 100
}

function getNewMatchId(matchId : string) {
    const newMatchIdNumber = Number(matchId.split('_')[1]) + 1
    return matchId.split('_')[0] + '_' + newMatchIdNumber
}

async function my_main() {
    let matchId = 'EUW1_6316539626'
    //let matchId = 'EUW1_6316539626'
    setInterval(async () => {
        const matchInfos = await fetchMatchHistory(matchId, region)
        if (matchInfos && matchInfos.info.queueId == 420) {
            const forecast = createForecast(matchId, region, matchInfos)
            const accumulatedForecasts = openJson<AccumulatedForecasts>('accumulatedForecasts.json')
            accumulateForecast(accumulatedForecasts, forecast)
            fs.writeFileSync('accumulatedForecasts.json', JSON.stringify(accumulatedForecasts, null, 3))
        } else if (matchInfos && matchInfos.info.queueId != 420) {
            console.log('game ' + matchId + ' queueId : ' + matchInfos.info.queueId)
        }
        matchId = getNewMatchId(matchId)
    }, 5000)
}

await my_main()

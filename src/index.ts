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

function getAverageRankingOfMatch(participants : Participant[]) {
    for (const participant of participants) {
        // getPlayerRank(participant.summonerId, 'RANKED_SOLO_5x5')
    }
    return 'PLATINE'
}

function isMatchRelevant(matchInfos : FetchMatchHistoryType) : boolean {
    if (matchInfos.info.queueId != 420)
        return false
    //TODO remove/rename below and do : if you see someone not a gold plat dia or silver just don't count the game.
    const averageRank = getAverageRankingOfMatch(matchInfos.info.participants)
    // console.log(averageRank)
    return true
}

async function my_main() {
    const accumulatedForecasts = openJson<AccumulatedForecasts>('accumulatedForecasts.json')
    let matchId = accumulatedForecasts.latestMatchId
    //let matchId = 'EUW1_6316539626' my ranked flex 59%
    setInterval(async () => {
        const matchInfos = await fetchMatchHistory(matchId, region)
        if (matchInfos && isMatchRelevant(matchInfos)) {
            const forecast = createForecast(matchId, region, matchInfos)
            const accumulatedForecasts = openJson<AccumulatedForecasts>('accumulatedForecasts.json')
            accumulateForecast(accumulatedForecasts, forecast)
            fs.writeFileSync('accumulatedForecasts.json', JSON.stringify(accumulatedForecasts, null, 3))
        } else if (matchInfos && matchInfos.info.queueId != 420) {
            console.log('matchId: ' + matchId + ' unwanted queue id')
        }
        matchId = getNewMatchId(matchId)
    }, 2000)
}

await my_main()

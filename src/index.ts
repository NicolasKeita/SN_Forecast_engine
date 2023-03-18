/*
    Path + Filename: src/index.ts
*/

import fs from 'fs'

import {fetchMatch, FetchMatchHistoryType, Participant} from './LOL_API/fetchMatch.js'
import {computeWinPercentage} from './computeWinrateBetweenTwoTeams.js'
import fetchRank from './LOL_API/fetchRank.js'
import {Champion} from './Champion.js'
import allChampions from './allChampions.json' assert {type: "json"}
import {mySetInterval, openJson} from './my_JS_utils.js'

//const matchId = 'EUW1_6316539626'
const region = 'euw1'
const saveFilename = 'accumulatedForecasts.json'

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
        winner: matchInfos.info.participants[0].win ? WinningTeam.TeamOne : WinningTeam.TeamTwo,
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

async function isMatchRelevant(matchInfos: FetchMatchHistoryType): Promise<boolean> {
    enum RelevantRanks {
        "DIAMOND",
        "PLATINUM",
        "GOLD",
    }

    if (matchInfos.info.queueId != 420)
        return false
    for (let i = 0; i < 10; ++i) {
        const participant = matchInfos.info.participants[i]
        const participantRank = await fetchRank(participant.summonerId, matchInfos.info.platformId)
        if (!participantRank) {
            console.log(`matchId: ${matchInfos.metadata.matchId} One guy was unranked`)
            return false
        }
        if (participantRank && !(participantRank in RelevantRanks)) {
            console.log(`matchId: ${matchInfos.metadata.matchId} ${participantRank} RANK not interesting`)
            return false
        }
        if (i == 9)
            console.log(`Player name : ${participant.summonerName} and his elo : ${participantRank}`)
    }
    return true
}

function debugForecast(forecast : Forecast) {
    console.log(`matchId: ${forecast.matchId} forecast accomplished`)
    const teamOne : string[] = []
    const teamTwo : string[] = []
    const allChamps = allChampions
    for (const champId of forecast.teams[0]) {
        const champ = (Object.values(allChamps) as Champion[]).find(champ => champ.id == champId)
        if (champ)
            teamOne.push(champ.name)
        else
            teamOne.push(`champId not found ${champId}`)
    }
    for (const champId of forecast.teams[1]) {
        const champ = (Object.values(allChamps) as Champion[]).find(champ => champ.id == champId)
        if (champ)
            teamTwo.push(champ.name)
        else
            teamTwo.push(`champId not found ${champId}`)
    }
    console.log("Team1")
    console.log(teamOne)
    console.log("Team2")
    console.log(teamTwo)
    if ((forecast.winPercentage > 50 && forecast.winner == WinningTeam.TeamOne)
        || (forecast.winPercentage < 50 && forecast.winner == WinningTeam.TeamTwo))
        console.log(`win percentage : ${forecast.winPercentage}% CORRECT winner is team ${forecast.winner + 1}`)
    else
        console.log(`win percentage : ${forecast.winPercentage}% INCORRECT winner is team ${forecast.winner + 1}`)
}

function getLastMatchIdAnalysed(filename : string) : string {
    const accumulatedForecasts = openJson<AccumulatedForecasts>(filename)
    return accumulatedForecasts.latestMatchId
}

//let matchId = 'EUW1_6316539626' my ranked flex 59%
async function myMain() {
    let matchId = getLastMatchIdAnalysed(saveFilename)

    const fetchForecastAndSave = async () => {
        const matchInfos = await fetchMatch(matchId, region)
        if (matchInfos && await isMatchRelevant(matchInfos)) {
            const forecast = createForecast(matchId, region, matchInfos)
            debugForecast(forecast)
            const accumulatedForecasts = openJson<AccumulatedForecasts>(saveFilename)
            accumulateForecast(accumulatedForecasts, forecast)
            fs.writeFileSync(saveFilename, JSON.stringify(accumulatedForecasts, null, 3))
        } else if (matchInfos && matchInfos.info.queueId != 420) {
            console.log('matchId: ' + matchId + ' unwanted queue id : ' + matchInfos.info.queueId)
        }
        matchId = getNewMatchId(matchId)
    }
    await mySetInterval(fetchForecastAndSave, 1000)
}

await myMain()

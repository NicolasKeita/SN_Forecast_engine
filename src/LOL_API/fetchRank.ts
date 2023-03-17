/*
    Path + Filename: src/LOL_API/fetchRank.ts
*/

import {sleep} from '../my_JS_utils.js'

let amountOfRequest = 0
let resetTime = -1

// TODO move to indepepdnant file and put Limits to every fetch outthere
type LimitsRate = {
    amountAllowed : number,
    period : number //in miliseconds
}

async function fetchRank(matchId: string, summonerRegion: string, limits : LimitsRate): Promise<string | null> {
    amountOfRequest += 1
    if (Date.now() > resetTime) {
        resetTime = Date.now() + limits.period
        amountOfRequest = 1
    } else {
        if (amountOfRequest > limits.amountAllowed) {
            console.error(`Maximun amount of request for FetchRank is being reached, waiting ${(resetTime - Date.now()) / 1000} seconds`)
            await sleep(resetTime - Date.now())
        }
    }
    console.log("Ending Fetchrank")
    return fetchRank_(matchId, summonerRegion)
}

//TODO do a retry strategy
async function fetchRank_(matchId: string, summonerRegion: string): Promise<string | null> {
    const url = `https://4nuo1ouibd.execute-api.eu-west-3.amazonaws.com/csw_api_proxy/fetchRank/${matchId}/${summonerRegion.toLowerCase()}`
    let res: Response
    try {
        res = await fetch(url, {
            headers: {
                'X-Api-Key': 'gRpS5xTEMG9V5EQP4a0DB3SBk8XLGydq9HlTU5HZ'
            }
        })
        if (res.status == 429) {
            throw new Error('429 code ')
        }
        else if (res.status == 404) {
            console.error("matchId: " + matchId + " = " + res.statusText)
            return null
        }
    } catch (e) {
        throw new Error(
            'CSW_error: following call : fetch(' + url + ' caught' + ' error;  ' + e)
    }
    try {
        const ranks : FetchRank[] = await res.json()
        for (const rank of ranks) {
            if (rank.queueType == 'RANKED_SOLO_5x5')
                return rank.tier
        }
        return null
    } catch (err: unknown) {
        const e = err as Error
        throw new Error(e.message)
    }
}

export type FetchRank = {
    leagueId:     string;
    queueType:    string;
    tier:         string;
    rank:         string;
    summonerId:   string;
    summonerName: string;
    leaguePoints: number;
    wins:         number;
    losses:       number;
    veteran:      boolean;
    inactive:     boolean;
    freshBlood:   boolean;
    hotStreak:    boolean;
}


export default fetchRank
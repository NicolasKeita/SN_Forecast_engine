/*
    Path + Filename: src/LOL_API/fetchRank.ts
*/

import {LimitsRate} from '../my_JS_utils.js'

// TODO move to indepepdnant file and put Limits to every fetch outthere
// Another TODO : add another limit rate, another block inside the object?

// fetchRank is limited to 100 requests per 60 seconds
const fetchRankLimitRate = new LimitsRate(98, 60 * 1000);

export default async function fetchRank(matchId: string,
                                        summonerRegion: string,
                                        globalLimits : LimitsRate | null = null,
                                        endpointLimits : LimitsRate = fetchRankLimitRate) : Promise<string | null> {
    return await endpointLimits.patientlyExecWithRetry(_fetchRank, matchId, summonerRegion)
}

async function _fetchRank(matchId: string, summonerRegion: string): Promise<string | null> {
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
        const ranks : FetchRankResponse[] = await res.json()
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

type FetchRankResponse = {
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
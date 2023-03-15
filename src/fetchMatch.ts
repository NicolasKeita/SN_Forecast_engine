/*
    Path + Filename: src/fetchMatch.ts
*/

import {FetchMatchHistoryType} from './fetchMatchHistory_type.js'

export async function fetchMatchHistory(matchId: string, summonerRegion: string): Promise<FetchMatchHistoryType | null> {
    const url = `https://4nuo1ouibd.execute-api.eu-west-3.amazonaws.com/csw_api_proxy/match/${summonerRegion.toLowerCase()}/${matchId}`
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
        return await res.json()
    } catch (err: unknown) {
        const e = err as Error
        throw new Error(e.message)
    }
}

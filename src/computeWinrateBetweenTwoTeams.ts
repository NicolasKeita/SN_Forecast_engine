/*
    Path + Filename: src/desktop/utils/computeWinrateBetweenTwoTeams/computeWinrateBetweenTwoTeams.ts
*/


import {Team} from './fetchMatchHistory_type.js'
import allChamps from './allChampions.json' assert { type: 'json' }
//TODO do a type check for json ? would help to narrow/secure deferencing

export function computeWinPercentage(teamOne : string[], teamTwo : string[]): number {
	for (const participantChampName of teamOne) {
		Object.values(allChamps).find((champ) => participantChampName == champ.name)
	}
	// allies[actorCellId].champ = allChamps.find((champ) => champ.id == championId) || getDefaultChampion()
	// allies[actorCellId].scoreDisplayed = allies[actorCellId].champ.opScore_user || 50
	return computeWinPercentageScore([1], [2])
}

function computeWinPercentageScore(alliesScores: number[], enemiesScores: number[]): number {
	let sumAllies = 0
	let sumEnemies = 0
	for (const allyScore of alliesScores)
		sumAllies += allyScore
	for (const enemyScore of enemiesScores)
		sumEnemies += enemyScore
	let winRate = (sumAllies / 5 - sumEnemies / 5) / 2 + 50
	let isInferiorTo50 = false
	if (winRate < 50) {
		isInferiorTo50 = true
		winRate = 50 - winRate + 50
	}
	winRate = 100.487 - 4965.35 * Math.exp(-0.0917014 * winRate)
	if (isInferiorTo50) {
		winRate = 100 - winRate
		return Math.floor(winRate)
	} else {
		return Math.ceil(winRate)
	}
}

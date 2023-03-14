/*
    Path + Filename: src/desktop/utils/computeWinrateBetweenTwoTeams/computeWinrateBetweenTwoTeams.ts
*/


import {Team} from './fetchMatchHistory_type.js'
import allChamps from './allChampions.json' assert { type: 'json' }
//TODO do a type check for json ? would help to narrow/secure deferencing
//TODO convert allChamps id of the champion to number instead of string

export function computeWinPercentage(teamOne : number[], teamTwo : number[]): number {
	const teamOneScore : number[] = []
	const teamTwoScore : number[] = []
	for (const participantChampId of teamOne) {
		const champ = Object.values(allChamps).find((champ) => participantChampId == Number(champ.id))
		if (champ)
			teamOneScore.push(champ.opScore_CSW)
		else
			console.error("No champ found", participantChampId)
	}
	for (const participantChampId of teamTwo) {
		const champ = Object.values(allChamps).find((champ) => participantChampId == Number(champ.id))
		if (champ)
			teamTwoScore.push(champ.opScore_CSW)
		else
			console.error("No champ found", participantChampId)
	}
	return computeWinPercentageScore(teamOneScore, teamTwoScore)
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

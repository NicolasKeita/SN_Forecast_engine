/*
    Path + Filename: src/desktop/utils/computeWinrateBetweenTwoTeams/computeWinrateBetweenTwoTeams.ts
*/

import allChamps from "./allChampions.json" assert {type: "json"}
import {Champion, championConstructor} from './Champion.js'
import {ChampionAttributes, ChampionTagsType} from './champTags.js'
//TODO do a type check for json ? would help to narrow/secure deferencing
//TODO convert allChamps id of the champion to number instead of string


function addToArrayNoDuplicate(myArray, value) {
	if (!myArray.includes(value))
		myArray.push(value)
}

function addLanerAndJunglerTag(tags: ChampionTagsType) {
	if (tags.attributes.find(tag => tag == (ChampionAttributes.visibleTags.JUNGLE_GANKER || ChampionAttributes.visibleTags.JUNGLE_FARMER))) {
		tags.attributes.push(ChampionAttributes.hiddenTags.JUNGLER)
	} else
		tags.attributes.push(ChampionAttributes.hiddenTags.LANER)
}

function adjustTags(tags: ChampionTagsType) {
	if (tags.attributes.includes(ChampionAttributes.visibleTags.HEALER_ISH)) {
		addToArrayNoDuplicate(tags.weakAgainst, ChampionAttributes.visibleTags.POTENTIAL_GREVIOUS_WOUNDS)
	}
	if (tags.attributes.includes(ChampionAttributes.visibleTags.JUNGLE_GANKER) || tags.attributes.includes(ChampionAttributes.visibleTags.LANE_BULLY)) {
		addToArrayNoDuplicate(tags.weakAgainst, ChampionAttributes.visibleTags.UNKILLABLE_LANER)
	}

	if (tags.attributes.includes(ChampionAttributes.visibleTags.POTENTIAL_GREVIOUS_WOUNDS)) {
		addToArrayNoDuplicate(tags.strongAgainst, ChampionAttributes.visibleTags.HEALER_ISH)
	}
	if (tags.attributes.includes(ChampionAttributes.visibleTags.UNKILLABLE_LANER)) {
		addToArrayNoDuplicate(tags.strongAgainst, ChampionAttributes.visibleTags.JUNGLE_GANKER)
		addToArrayNoDuplicate(tags.strongAgainst, ChampionAttributes.visibleTags.LANE_BULLY)
	}
	addLanerAndJunglerTag(tags)
	return tags
}

const allChampsWithTags = Object.values(allChamps).map((champ) => {
	if (champ.tags === undefined) {
		console.log(champ.name)
		throw new Error('KO')
	}
	return championConstructor(
		champ.name,
		champ.opScore_CSW,
		champ.opScore_CSW,
		champ.role,
		champ.image,
		'',
		Number(champ.id),
		champ.nameFormatted,
		adjustTags(champ.tags as ChampionTagsType)
	)
})

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
		const champ = Object.values(allChampsWithTags).find((champ : Champion) => participantChampId == Number(champ.id))
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

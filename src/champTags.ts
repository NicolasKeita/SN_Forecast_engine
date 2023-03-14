/*
    Path + Filename: src/desktop/utils/champTags/champTags.ts
*/

import {Champion} from './Champion.js'
import {rolesChampSelect} from './ChampSelect.js'

enum VisibleTags {
	HEALER_ISH = 'Healer-ish',
	POTENTIAL_GREVIOUS_WOUNDS = 'Potential Grievous Wounds',
	UNKILLABLE_LANER = 'Unkillable laner',
	POTENTIAL_ZHONYA_OWNER = 'Potential Zhonya owner',
	LANE_BULLY = 'Lane Bully',
	CC = 'CC',
	AP = 'AP',
	AD = 'AD',
	TANK = 'Tank',
	RANGED = 'Ranged',
	MELEE = 'Melee',
	JUNGLE_FARMER = 'Jungle Farmer',
	JUNGLE_GANKER = 'Ganker'
}

enum HiddenTags {
	LANER = 'Laner',
	JUNGLER = 'Jungler'
}

export const ChampionAttributes = {
	visibleTags: VisibleTags,
	hiddenTags: HiddenTags
}

export type ChampionTag = `${VisibleTags}` | `${HiddenTags}`

export type ChampionTagsType = {
	attributes: ChampionTag[],
	strongAgainst: ChampionTag[],
	weakAgainst: ChampionTag[]
}

function getTagBonus(allyTags: ChampionTagsType,
					 enemyTags: ChampionTagsType,
					 tag: ChampionTag,
					 isLaneOpponent: boolean,
					 bonusAmount: number): number {

	if (enemyTags.attributes.includes(tag)) {
		const isEnemyJungler = enemyTags.attributes.includes(ChampionAttributes.hiddenTags.JUNGLER)
		// const isEnemyJungler = !!enemyTags.attributes.find(enemyTag => enemyTag == (championAttributes.visibleTags.JUNGLE_GANKER || championAttributes.visibleTags.JUNGLE_FARMER))
		//special case unkillable laner needs to respect lanes
		if ((enemyTags.strongAgainst.includes(ChampionAttributes.visibleTags.UNKILLABLE_LANER)
				|| enemyTags.weakAgainst.includes(ChampionAttributes.visibleTags.UNKILLABLE_LANER))
			&& !isLaneOpponent && !isEnemyJungler)
			return 0
		if (allyTags.strongAgainst.includes(tag)) {
			return +bonusAmount
		} else if (allyTags.weakAgainst.includes(tag))
			return -bonusAmount
	}
	return 0
}

function getTagsBonusesSoloEnemy(allyTags: ChampionTagsType, enemyTags: ChampionTagsType, isLaneOpponent: boolean): number {
	return (
		getTagBonus(allyTags, enemyTags, ChampionAttributes.visibleTags.LANE_BULLY, isLaneOpponent, 5)
		+ getTagBonus(allyTags, enemyTags, ChampionAttributes.visibleTags.HEALER_ISH, isLaneOpponent, 5)
		+ getTagBonus(allyTags, enemyTags, ChampionAttributes.visibleTags.UNKILLABLE_LANER, isLaneOpponent, 5)
		+ getTagBonus(allyTags, enemyTags, ChampionAttributes.visibleTags.POTENTIAL_ZHONYA_OWNER, isLaneOpponent, 5)
		+ getTagBonus(allyTags, enemyTags, ChampionAttributes.visibleTags.JUNGLE_GANKER, isLaneOpponent, 5)
		+ getTagBonus(allyTags, enemyTags, ChampionAttributes.visibleTags.POTENTIAL_GREVIOUS_WOUNDS, isLaneOpponent, 5)
	)
}

export function getTagsBonuses(ally: Champion, enemies: Champion[]): number {
	return enemies.reduce((accumulator, enemy) => {
		let isLaneOpponent: boolean | undefined
		if ((ally.role == rolesChampSelect.ADC
			|| ally.role == rolesChampSelect.SUPPORT) && enemy.role == (rolesChampSelect.ADC || rolesChampSelect.SUPPORT)) {
			isLaneOpponent = true
		} else {
			isLaneOpponent = ally.role == enemy.role
		}
		return accumulator + getTagsBonusesSoloEnemy(ally.tags, enemy.tags, isLaneOpponent)
	}, 0)
}
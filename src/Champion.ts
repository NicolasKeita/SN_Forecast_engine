/*
    Path + Filename: src/desktop/components/maincontent/settings/Champion.ts
*/

import {ChampionTagsType} from './champTags.js'

export type Champion = {
	id: number
	image: string
	imageUrl?: string
	name: string
	nameFormatted: string
	opScore_CSW: number
	opScore_user?: number
	role: string,
	tags: ChampionTagsType
}

export function championConstructor(name = '',
									opScore_user = 50,
									opScore_CSW = 50,
									role = '',
									image = '',
									imageUrl = '',
									id = -1,
									nameFormatted = '',
									tags = {
										attributes: [],
										strongAgainst: [],
										weakAgainst: []
									} as ChampionTagsType
): Champion {
	return {
		name: name,
		nameFormatted: nameFormatted,
		opScore_user: opScore_user,
		opScore_CSW: opScore_CSW,
		role: role,
		image: image,
		imageUrl: imageUrl,
		id: id,
		tags: tags
	}
}

export function getDefaultChampion(): Champion {
	const defaultImageUrl: string = ''
	const defaultName = 'Champion Name'
	const defaultCSWScore = 50
	const defaultUserScore = 50
	const defaultRole = ''
	const defaultImage = ''
	const defaultId = -1
	const defaultNameFormatted = ''
	const defaultTags = {
		attributes: [],
		strongAgainst: [],
		weakAgainst: []
	} as ChampionTagsType
	return championConstructor(defaultName,
		defaultUserScore,
		defaultCSWScore,
		defaultRole,
		defaultImage,
		defaultImageUrl,
		defaultId,
		defaultNameFormatted,
		defaultTags)
}


export function championAssign(championTarget: Champion, championSource: Champion) {
	championTarget.name = championSource.name
	championTarget.id = championSource.id
	championTarget.imageUrl = championSource.imageUrl
	championTarget.role = championSource.role
	championTarget.opScore_user = championSource.opScore_user
	championTarget.opScore_CSW = championSource.opScore_CSW
	championTarget.nameFormatted = championSource.nameFormatted
	championTarget.image = championSource.image
	championTarget.tags = championSource.tags
}

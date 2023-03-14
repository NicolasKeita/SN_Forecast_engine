/*
    Path + Filename: src/types/ChampSelect.ts
*/


export interface ChampSelect {
	actions: Array<Action[]>;
	allowBattleBoost: boolean;
	allowDuplicatePicks: boolean;
	allowLockedEvents: boolean;
	allowRerolling: boolean;
	allowSkinSelection: boolean;
	bans: Bans;
	benchChampions: any[];
	benchEnabled: boolean;
	boostableSkinCount: number;
	chatDetails: ChatDetails;
	counter: number;
	entitledFeatureState: EntitledFeatureState;
	gameId: number;
	hasSimultaneousBans: boolean;
	hasSimultaneousPicks: boolean;
	isCustomGame: boolean;
	isSpectating: boolean;
	localPlayerCellId: number;
	lockedEventIndex: number;
	myTeam: Team[];
	pickOrderSwaps: any[];
	recoveryCounter: number;
	rerollsRemaining: number;
	skipChampionSelect: boolean;
	theirTeam: Team[];
	timer: Timer;
	trades: any[];
}

export interface Action {
	actorCellId: number;
	championId: number;
	completed: boolean;
	id: number;
	isAllyAction: boolean;
	isInProgress: boolean;
	type: Type;
}

export enum Type {
	Ban = 'ban',
	Pick = 'pick',
	TenBansReveal = 'ten_bans_reveal',
}

export interface Bans {
	myTeamBans: any[];
	numBans: number;
	theirTeamBans: any[];
}

export interface ChatDetails {
	chatRoomName: string;
	chatRoomPassword: null;
	multiUserChatJWT: string;
}

export interface EntitledFeatureState {
	additionalRerolls: number;
	unlockedSkinIds: any[];
}

export enum rolesChampSelect {
	TOP = 'top',
	JUNGLE = 'jungle',
	MID = 'middle',
	ADC = 'bottom',
	SUPPORT = 'utility',
	NONE = ''
}

export type RoleChampSelect = `${rolesChampSelect}`;

export interface Team {
	assignedPosition: RoleChampSelect;
	cellId: number;
	championId: number;
	championPickIntent: number;
	entitledFeatureType: EntitledFeatureType;
	nameVisibilityType: NameVisibilityType;
	puuid: string;
	selectedSkinId: number;
	spell1Id: number;
	spell2Id: number;
	summonerId: number;
	team: number;
	wardSkinId: number;
	summonerInfo?: SummonerInfo;
}

export enum EntitledFeatureType {
	Empty = '',
	None = 'NONE',
}

export enum NameVisibilityType {
	Hidden = 'HIDDEN',
	Unhidden = 'UNHIDDEN',
}

export interface SummonerInfo {
	accountId: number;
	displayName: string;
	internalName: string;
	nameChangeFlag: boolean;
	percentCompleteForNextLevel: number;
	privacy: string;
	profileIconId: number;
	puuid: string;
	rerollPoints: RerollPoints;
	summonerId: number;
	summonerLevel: number;
	unnamed: boolean;
	xpSinceLastLevel: number;
	xpUntilNextLevel: number;
}

export interface RerollPoints {
	currentPoints: number;
	maxRolls: number;
	numberOfRolls: number;
	pointsCostToRoll: number;
	pointsToReroll: number;
}

export interface Timer {
	adjustedTimeLeftInPhase: number;
	internalNowInEpochMs: number;
	isInfinite: boolean;
	phase: string;
	totalTimeInPhase: number;
}

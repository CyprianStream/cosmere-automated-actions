import { TurnChangeEffectFunc, TurnChangeItemFunc } from "../index.js";

export var startTurnItemMap: Map<string, TurnChangeItemFunc> = new Map<string, TurnChangeItemFunc>([]);

export var startTurnEffectMap: Map<string, TurnChangeEffectFunc> = new Map<string, TurnChangeEffectFunc>([]);
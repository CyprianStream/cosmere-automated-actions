import { TurnChangeEffectFunc, TurnChangeItemFunc } from "..";

export var endTurnItemMap: Map<string, TurnChangeItemFunc> = new Map<string, TurnChangeItemFunc>([]);

export var endTurnEffectMap: Map<string, TurnChangeEffectFunc> = new Map<string, TurnChangeEffectFunc>([]);
import { macros, roundIncriment } from "./macros/index.js";
import { registerModuleSettings } from "./utils/settings.js";
import { nameToId } from "./utils/helpers.js";
import { MODULE_ID } from "./utils/constants.js";
import { applyRollConditions, decrementExhausted } from "./automations/conditions.js";

Hooks.once('init', () => {
	globalThis.cosmereAutomatedActions = {
		macros,
        roundIncriment,
	}

	registerModuleSettings();
});

//Automates item actions
Hooks.on('cosmere-rpg.useItem', (item, _rollConfig, _options) => {
	if(!game.settings.get(MODULE_ID, "useAutomations")){
		return;
	};
    //Gets item ID, checks if item has an associated macro, and then calls it
    const actor = item.actor;
    var itemId = item.system.id;
	if(itemId = "new-action"){itemId = nameToId(item.name)};
    const macro = cosmereAutomatedActions.macros[itemId];
    if(macro) macro(item,actor);
})

//Adds conditions to attack rolls
//Potentially replace after Roll Refactor
Hooks.on('cosmere-rpg.attackRoll', (roll, item, _options) => {
    if(!game.settings.get(MODULE_ID, "automateConditions")){
        return;
    };
    const actor = item.actor;
    console.log("CAA | Applying Roll Conditions");
    applyRollConditions(roll, actor);
});

//Adds conditions to skill rolls
//Potentially replace after Roll Refactor
Hooks.on('cosmere-rpg.skillRoll', (roll, actor, _options) => {
    if(!game.settings.get(MODULE_ID, "automateConditions")){
        return;
    };
    console.log("CAA | Applying Roll Conditions");
    applyRollConditions(roll, actor);
});

//Automatically remove one level of exhaustion after long rest
Hooks.on('cosmere-rpg.rest', (actor, length) => {
	if(!game.settings.get(MODULE_ID, "decrementExhaustion")){
        return;
    };
	if(actor.effects.get("condexhausted000") && length === "long"){
		decrementExhausted(actor);
	};
});

//Automated items that incriment during combat
Hooks.on('combatTurnChange', (cosmereCombat) => {
    if(!game.settings.get(MODULE_ID, "useAutomations")){
		return;
	};
    //loops through combatants checking each item for a round incrimenting item
    cosmereCombat.turns.forEach((combatant)=>{
        combatant.actor.items.forEach((item)=>{
            var itemId = item.system.id;
	        if(itemId = "new-action"){itemId = nameToId(item.name)};
            const roundIncriment = cosmereAutomatedActions.roundIncriment[itemId];
            if(roundIncriment){
                roundIncriment(item, combatant.actor);
            };
        });
    });
});
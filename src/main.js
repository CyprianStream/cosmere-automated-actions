import { macros } from "./macros/index.js";
import { registerModuleSettings } from "./utils/settings.js";
import { nameToId } from "./utils/helpers.js";
import { MODULE_ID } from "./utils/constants.js";
import { applyRollConditions, decrementExhausted } from "./automations/conditions.js";

Hooks.once('init', () => {
	globalThis.cosmereAutomatedActions = {
		macros,
	}

	registerModuleSettings();

	// Preload Handlebars templates.
	//return preloadHandlebarsTemplates();
});

Hooks.on('cosmere-rpg.useItem', (item, _rollConfig, _options) => {
	if(!game.settings.get(MODULE_ID, "useAutomations")){
		return
	}
    const actor = item.actor;
    var itemId = item.system.id;
	if(itemId = "new-action"){itemId = nameToId(item.name)}
    const macro = cosmereAutomatedActions.macros[itemId];
    if(macro) macro(item,actor);
})

Hooks.on('cosmere-rpg.attackRoll', (roll, item, _options) => {
    if(!game.settings.get(MODULE_ID, "automateConditions")){
        return
    }
    const actor = item.actor
    console.log("CAA | Applying Roll Conditions")
    applyRollConditions(roll, actor)
})


Hooks.on('cosmere-rpg.skillRoll', (roll, actor, _options) => {
    if(!game.settings.get(MODULE_ID, "automateConditions")){
        return
    }
    console.log("CAA | Applying Roll Conditions")
    applyRollConditions(roll, actor)
})

Hooks.on('cosmere-rpg.rest', (actor, length) => {
	if(!game.settings.get(MODULE_ID, "decrementExhaustion")){
        return
    }
	if(actor.effects.get("condexhausted000") && length === "long"){
		decrementExhausted(actor)
	}
})
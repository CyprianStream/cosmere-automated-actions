import { handbookMacros } from "./macros/handbook-macros.js";
import { worldguideMacros } from "./macros/worldguide-macros.js";
import { starterRulesMacros } from "./macros/starter-rules-macros.js"
import { registerModuleSettings } from "./utils/settings.js";
import { OFFICIAL_MODULES } from "./utils/constants.js";
import { IsModuleActive } from "./utils/helpers.js";

Hooks.once('init', () => {
	globalThis.cosmereAutomatedActions = {
		handbookMacros,
		starterRulesMacros,
		worldguideMacros
	}

	registerModuleSettings();

	// Preload Handlebars templates.
	//return preloadHandlebarsTemplates();
});

Hooks.on('cosmere-rpg.useItem', (item, _rollConfig, _options) => {
	const actor = item.actor;
	const itemId = item.system.id;
	switch (item.system.type) {
		//any case that could be either handbook or starter rules
		case "basic":
		case "path":
		case "stormlight":
		case "surge":
		case "power":
			if (IsModuleActive(OFFICIAL_MODULES.handbook)) {
				cosmereAutomatedActions.handbookMacros[itemId](item, actor);
			} else {
				cosmereAutomatedActions.starterRulesMacros[itemId](item, actor);
			}
			break;
		//any case that could be world guide or starter rules
		case "adversary feature":
			if (IsModuleActive(OFFICIAL_MODULES.worldguide)) {
				cosmereAutomatedActions.worldguideMacros[itemId](item, actor);
			} else {
				cosmereAutomatedActions.starterRulesMacros[itemId](item, actor);
			}
			break;
		default: return;
	}
})

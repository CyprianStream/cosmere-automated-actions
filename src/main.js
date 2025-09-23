import { macros } from "./macros/index.js";
import { registerModuleSettings } from "./utils/settings.js";
import { OFFICIAL_MODULES } from "./utils/constants.js";
import { IsModuleActive } from "./utils/helpers.js";

Hooks.once('init', () => {
	globalThis.cosmereAutomatedActions = {
		macros,
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
		case "adversary feature": {
			cosmereAutomatedActions.macros[itemId](item, actor);
		}
		default: return;
	}
})

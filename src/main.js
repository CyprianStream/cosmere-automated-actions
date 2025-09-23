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
    const macro = cosmereAutomatedActions.macros[itemId];
    if(macro) macro(item,actor);
})

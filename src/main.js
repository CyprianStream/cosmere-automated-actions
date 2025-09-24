import { macros } from "./macros/index.js";
import { registerModuleSettings } from "./utils/settings.js";
import { nameToId } from "./utils/helpers.js";

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
    var itemId = item.system.id;
	if(itemId = "new-action"){itemId = nameToId(item.name)}
    const macro = cosmereAutomatedActions.macros[itemId];
    if(macro) macro(item,actor);
})

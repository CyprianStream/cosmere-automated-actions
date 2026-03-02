import { CosmereActor } from "@src/declarations/cosmere-rpg/documents";
import { Resource } from "@src/declarations/cosmere-rpg/types/cosmere";
import { MODULE_ID } from "@module/constants";

export const TEMPLATES = {
    RECOVER_PROMPT: `modules/${MODULE_ID}/templates/prompts/recover/recover.hbs`,
    RECOVER_RESOURCE: `modules/${MODULE_ID}/templates/prompts/recover/recover-resource.hbs`
} as const;

/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
    const templates = Object.values(TEMPLATES).reduce(
        (partials, path) => {
            partials[path.split('/').pop()!.replace('.hbs', '')] =
                `${path}`;
            return partials;
        },
        {} as Record<string, string>,
    );

    return await foundry.applications.handlebars.loadTemplates(templates);
};


Handlebars.registerHelper('recoverResourceContext', (root: any, resourceId: Resource) => {
    let actor: CosmereActor = root.actor;
    let gained: Record<Resource, number> = root.gained;
    let resourceGained = gained[resourceId];
    // Get resource
    const resource = actor.system.resources[resourceId];

    // Get resource config
    const config = CONFIG.COSMERE.resources[resourceId];

    // Get value and max
    const value = resource.value + gained[resourceId];
    const max = resource.max.value;
    return {
        resource: {
            id: resourceId,
            label: config.label,
            value: value,
            max: max,
        },
        gained: resourceGained,
        pointsRemaining: root.pointsRemaining
    }
});
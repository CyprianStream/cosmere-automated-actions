import { MODULE_ID } from "./constants"

export const settings = [
    {
        name: "Use Automations",
        id: "useAutomations",
        hint: "Toggles CAA automations on or off across all sheets",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        requiresReload: false,
    },
    {
        name: "Track Dun Spheres",
        id: "sphereDunning",
        hint: "Automatically Dun and Infuse spheres as they are used",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        requiresReload: false
    }
]

export function registerModuleSettings(){
    settings.forEach(setting => {
        game.settings.register(MODULE_ID, setting.id, setting)
    });
}








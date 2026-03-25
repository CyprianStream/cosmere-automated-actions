import { CosmereItem, CosmereActor } from "@system/documents";
import { log, giveActorItem, giveActorEffect, deleteItemAndDescendants } from "@module/utils/helpers";
import { MODULE_ID } from "@module/constants";

//#region Effect Create Data
const disguiseEffectDefaultCreateData: ActiveEffect.CreateData = {
    "name": "Disguised",
    "img": "icons/magic/unholy/silhouette-robe-evil-power.webp",
    "disabled": false,
    "duration": {
        "rounds": 1,
        "startTime": null,
        "seconds": null,
        "combat": null,
        "turns": null,
        "startRound": null,
        "startTurn": null
    },
    "_id": "nblczTlWrh4Z7uXU",
    "type": "base",
    //@ts-ignore
    "system": {
        "isStackable": false,
        "stacks": null
    },
    "changes": [],
    "description": "",
    "origin": null,
    "tint": "#ffffff",
    "transfer": true,
    "statuses": [],
    "sort": 0,
    "flags": {}
}
//#endregion

// MACROS
//#region Macro Functions
export async function illumination(item: CosmereItem, actor: CosmereActor){
    await foundry.applications.api.DialogV2.wait({
        window: { title: "Illumination" },
        content: "<p>What would you like to lightweave?</p>",
        buttons: [
            {
                label: "Simple Illusion",
                action: "simple-illusion",
                callback: () => {
                    log("simple illusion, currently no functionality");
                }
            },
            {
                label: "Complex Illusion",
                action: "complex-illusion",
                callback: async () => { createComplexIllusion(item, actor) }
            },
            {
                label: "Disguise Yourself",
                action: "disguise-yourself",
                callback: async () => { applySelfDisguise(item, actor) }
            }
        ]
    })

}

export async function cancelComplexIllusion(item: CosmereItem, actor: CosmereActor){
    await deleteItemAndDescendants(item);
}
export async function cancelDisguise(item: CosmereItem, actor: CosmereActor){
    await deleteItemAndDescendants(item);
}
//#endregion

// START TURN EFFECTS
//#region Start Turn Effects
export async function complexIllusionTurnStart(item: CosmereItem, actor: CosmereActor, turn: Combat.HistoryData){
    //Subtracts 1 investiture from actor every combat round
    const actorInv = actor.system.resources.inv.value;
    if(actorInv < 1){
        cancelComplexIllusion(item, actor);
        return;
    }
    const newInv = actorInv - 1;
    actor.update({ 'system.resources.inv.value': newInv } as any);
}
//#endregion

// INVESTITURE CHANGE EFFECTS
//#region Inv Change Effects

//TODO: add inv-to-zero to remove self disguise

//#endregion

// HELPERS
//#region Helpers
async function applySelfDisguise(item: CosmereItem, actor: CosmereActor){
    //TODO: This should not spend investiture
    //adds "Dismiss Disguise" item to actor
    const dismissDisguiseUUID = "Compendium.cosmere-automated-actions.caaactions.Item.3SdIMgwufXgAfQmM";
    const dismissDisguise = await giveActorItem(actor, dismissDisguiseUUID);

    //Adds "Gravitation Infusion" item to target
    var disguiseEffectCreateData = foundry.utils.deepClone(disguiseEffectDefaultCreateData);

    if(dismissDisguise){
        const disguiseEffect = await giveActorEffect(actor, disguiseEffectCreateData);
        dismissDisguise.setFlag(MODULE_ID, "descendantUuids", [disguiseEffect?.uuid!]);
    }
}

async function createComplexIllusion(item: CosmereItem, actor: CosmereActor){
    //adds "Dismiss Complex Illusion" item to actor
    const dismissComplexIllusionUUID = "Compendium.cosmere-automated-actions.caaactions.Item.EZqaHREQyTkBiRIb";
    const dismissComplexIllusion = await giveActorItem(actor, dismissComplexIllusionUUID);
}

//#endregion
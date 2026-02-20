import { CosmereItem, CosmereActor, CosmereActiveEffect } from "@system/documents";
import { deleteDescendantUuids, getFirstTarget, giveActorEffect, giveActorItem, log } from "@module/utils/helpers";
import { DVS } from "./talent-ids";
import { getSurgeTalents, expendEffectInvestiture, useCanceled, getInfusionInvestiture } from "../helpers/surge-helpers";
import { MODULE_ID, SYSTEM_ID } from "@module/constants";

//#region Effect Create Data
//#endregion

// MACROS
//#region Macro Functions
export async function division(item: CosmereItem, actor: CosmereActor){
    //prompt user for target mode
    await foundry.applications.api.DialogV2.wait({
        window: { title: "Division" },
        content: "<p>What would you like to target?</p>",
        buttons: [
            {
                label: "Character",
                action: "character",
                callback: async () => { useDivisionAttack(item, actor) }
            },
            {
                label: "Area",
                action: "area",
                callback: async () => { useDivisionArea(item, actor) }
            }
        ]
    });
}

//#endregion

// START TURN EFFECTS
//#region Start Turn Effects

//#endregion

// INVESTITURE CHANGE EFFECTS
//#region Inv Change Effects

//#endregion

// HELPERS
//#region Helpers
async function useDivisionAttack(item: CosmereItem, actor: CosmereActor){
    const target = getFirstTarget();
    //If attacking character, makes attack roll and post it to chat
    const currentInv = actor.system.resources.inv.value;
    if(!target){
        ui.notifications?.warn("Needs target");
        useCanceled(item, actor);
        return;
    };
    //makes attack roll
    if(!item.system.damage.formula){
        item.system.damage.formula = "3@scalar.power.dvs.die";
    };
    const rollOptions = {
        skillTest: {
            skill: "dvs",
        },
        chatMessage: false,
    };
    let attackRoll = await item.rollAttack(rollOptions);
    if(!attackRoll){
        return;
    }
    const messageConfig = {
        user: game.user?.id,
        speaker: ChatMessage.getSpeaker({ actor }),
        rolls: [attackRoll[0], attackRoll[1][0]],
        flags: {
            [SYSTEM_ID]: {}
        }
    };
    // Create chat message
    messageConfig.flags["cosmere-rpg"] = {
        message: {
            type: 'action',
            // @ts-ignore - accessing protected method
            description: await item.getDescriptionHTML(),
            item: item.id,
        },
    };
    await ChatMessage.create(messageConfig);
}

async function useDivisionArea(item: CosmereItem, actor: CosmereActor){

    const actorDivisionRank = actor.system.skills.dvs.rank;
    //If attacking an area, subtract investiture based on size, then output chat message
    //TODO add area effect
    const currentInv = actor.system.resources.inv.value;
    const infusionCost: Map<string, number> = new Map<string, number>([
        ["gargantuan", 4],
        ["huge", 3],
        ["large", 2],
        ["medium", 1],
        ["small", 0]
    ]);
    let divisionAreaButtons = []
    switch (actorDivisionRank){
        default:
        case 5:
            divisionAreaButtons.unshift({
                label: "Gargantuan",
                action: "gargantuan"
            });
        case 4:
            divisionAreaButtons.unshift({
                label: "Huge",
                action: "huge"
            });
        case 3:
            divisionAreaButtons.unshift({
                label: "Large",
                action: "large"
            });
        case 2:
            divisionAreaButtons.unshift({
                label: "Medium",
                action: "medium"
            });
        case 1:
            divisionAreaButtons.unshift({
                label: "Small",
                action: "small"
            });
        break;
    };
    //Prompts user for how big of an area they are attacking
    const divisionAreaDialog = await foundry.applications.api.DialogV2.wait({
        window:{ title: "Division"},
        content: "How large is your target area?",
        buttons: divisionAreaButtons
    });
    const areaSize = divisionAreaDialog as string;
    let newInv = currentInv - infusionCost.get(areaSize)!;
    if(newInv >= 0){
        actor.update({ 'system.resources.inv.value': newInv } as any)
        const chatMessageData = {
            author: game.user,
            speaker: ChatMessage.getSpeaker({ actor }),
            content: `${actor.name} uses ${item.name} on a ${areaSize} object or area`,
        };
        await ChatMessage.create(chatMessageData);
    } else {
        ui.notifications?.warn("Not enough investiture for infusion of that size");
    };
}

//#endregion
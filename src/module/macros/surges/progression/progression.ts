import { CosmereActiveEffect, CosmereActor, CosmereItem, MESSAGE_TYPES } from "@system/documents";
import { deleteDescendantUuids, getFirstTarget, giveActorEffect, giveActorItem, log } from "../../../utils/helpers";
import { MODULE_ID, SYSTEM_ID } from "@src/module/constants";
import { expendEffectInvestiture, getSurgeTalents, sizes, getInfusionInvestiture, useCanceled, getAbilityDescription } from "../helpers/surge-helpers";
import { PRG } from "./talent-ids";
import { renderSystemTemplate, SYSTEM_TEMPLATES } from "@src/module/utils/system-templates";
import { DamageRollConfiguration } from "@src/declarations/cosmere-rpg/dice";
import { DamageType } from "@src/declarations/cosmere-rpg/types/cosmere";
import { damageRoll } from "@src/module/system-clones/dice";

//#region Macro Functions
export async function progression(item: CosmereItem, actor: CosmereActor){
    await foundry.applications.api.DialogV2.wait({
        window: { title: "Progression" },
        content: "<p>Which skill would you like to use?</p>",
        buttons:
        [{
            label: "Plant Growth",
            action: "plant growth",
            callback: async () => {applyPlantGrowthInfusion(item, actor)}
        },
        {
            label: "Character Regrowth",
            action: "character regrowth",
            callback: async () => {applyRegrowthInfusion(item, actor)}
        }]
    })
};

export async function cancelCharacterRegrowth(item: CosmereItem, actor: CosmereActor){
    //finds items from target and caster and deletes it
    await deleteDescendantUuids(item.getFlag(MODULE_ID, "descendantUuids"));
    item.delete();
}
//#endregion

//#region Start Turn Effects

export async function characterRegrowthEffectStartTurn(effect: CosmereActiveEffect, turn: Combat.HistoryData){
    const casterCancelItemUUID = effect.origin;
    const targetActor = effect.parent as CosmereActor;
    const casterCancelItem = await fromUuid(casterCancelItemUUID) as CosmereItem;
    const casterActor = casterCancelItem.parent as CosmereActor;
    if((!targetActor) || (!casterActor)){
        // TODO: We couldn't handle resolving the target or caster UUID
        return;
    }

    //heals target
    let progressionTalents = getSurgeTalents(casterActor, "prg");
    let swiftRegeneration = false;
    let rollFormula = "@scalar.power.prg.die";
    for(const talent of progressionTalents){
        if(talent.system.id == PRG.RELIABLE_PROGRESSION){
            let progressionRank = casterActor.system.skills.prg.rank;
            rollFormula = `{@scalar.power.prg.die, ${progressionRank}}kh`;
        }
        else if(talent.system.id == PRG.SWIFT_REGENERATION){
            swiftRegeneration = true;
        }
    }
    if(swiftRegeneration){
        rollFormula += ` + ${casterActor.system.skills.prg.mod.value}`;
    }
    //TODO: Add effects from Swift Healer and Applied Medicine
    const sectionHTML = await renderSystemTemplate(SYSTEM_TEMPLATES.CHAT_CARD_DESCRIPTION, {
        title: effect.name,
        img: effect.img,
        description: effect.description,
    });
    const messageConfig = {
        user: game.user?.id,
        speaker: ChatMessage.getSpeaker({ actor: casterActor }),
        rolls: [] as foundry.dice.Roll[],
        flags: {} as Record<string, unknown>,
    };

    messageConfig.flags[SYSTEM_ID] = {
        message: {
            type: MESSAGE_TYPES.ACTION,
            description: sectionHTML,
        },
    };

    const rollData = casterActor.getRollData();
    const damageRollConfig: DamageRollConfiguration = {
        formula: rollFormula,
        data: rollData,
        damageType: DamageType.Healing,
        damageSourceName: effect.name,
    }
    let r = await damageRoll(damageRollConfig);
    messageConfig.rolls.push(r as unknown as foundry.dice.Roll);
    // await r.toMessage(messageConfig);
    await ChatMessage.create(messageConfig);
    targetActor.applyHealing(r.total!);
    const targetHealth = targetActor.system.resources.hea.value;
    const newHealth = targetHealth + r.total!;
    await targetActor.update({ 'system.resources.hea.value': newHealth } as any);
}

export async function characterRegrowthExpendInvestiture(item: CosmereItem, actor: CosmereActor, turn: Combat.HistoryData){
    //TODO: Check if this is a boss turn before decrementing remaining investiture
    const effectsUUIDs = item.flags[MODULE_ID]?.descendantUuids
    for(const effectUUID of effectsUUIDs!){
        let effect = await fromUuid(effectUUID) as CosmereActiveEffect;
        let hasExtendedRegrowth = false;
        let progressionTalents = getSurgeTalents(actor, "prg");
        for(const talent of progressionTalents){
            if(talent.system.id == "extended-regrowth"){
                hasExtendedRegrowth = true;
            }
        }
        if(!await expendEffectInvestiture(effect, turn.round!, actor.system.skills.prg.rank, hasExtendedRegrowth)){
            cancelCharacterRegrowth(item, actor);
        }
    }
}
//#endregion

//#region Helpers
async function applyPlantGrowthInfusion(item: CosmereItem, actor: CosmereActor){
    const target = getFirstTarget();
    const actorProgressionRank = actor.system.skills.prg.rank;
    //Creates array of buttons based on actor progression rank
    let plantGrowthButtons = [];
    switch (actorProgressionRank){
        default:
        case 5:
            plantGrowthButtons.unshift({
                label: "Gargantuan",
                action: "gargantuan"
            });
        case 4:
            plantGrowthButtons.unshift({
                label: "Huge",
                action: "huge"
            });
        case 3:
            plantGrowthButtons.unshift({
                label: "Large",
                action: "large"
            });
        case 2:
            plantGrowthButtons.unshift({
                label: "Medium",
                action: "medium"
            });
        case 1:
            plantGrowthButtons.unshift({
                label: "Small",
                action: "small"
            });
        break;
    }
    const plantGrowthDialog = await foundry.applications.api.DialogV2.wait({
        window:{ title: "Plant Growth"},
        content: "How large would you like to grow the plant?",
        buttons: plantGrowthButtons
    })
    // Changes size of targeted token to the output of plantGrowthDialog
    if(target && plantGrowthDialog){
        await target.document.update(sizes[plantGrowthDialog]);
    };
}

async function applyRegrowthInfusion(item: CosmereItem, actor: CosmereActor){
    const target = getFirstTarget();
    const caster = actor
    if(!target){
        ui.notifications?.warn("Needs target");
        useCanceled(item, actor);
        return;
    }
    else if(!target.actor){
        ui.notifications?.warn("Needs target with an actor");
        useCanceled(item, actor);
        return;
    }
    let infusedInvestiture = await getInfusionInvestiture(item, actor);

    //Adds "Cancel Regrowth" item to caster
    const cancelRegrowthCasterUUID = "Compendium.cosmere-automated-actions.caaactions.Item.LNAzM5dFOJ4fqqdL";
    const cancelRegrowthCaster = await giveActorItem(actor, cancelRegrowthCasterUUID)
    if(cancelRegrowthCaster) {
        //Adds "Regrowth Infusion" item to target
        const regrowthInfusionEffectCreateData: ActiveEffect.CreateData = {
            name:`Character Regrowth (${infusedInvestiture} inv left)`,
            img: "icons/magic/life/cross-beam-green.webp",
            disabled: false,
            duration: {
                "rounds": infusedInvestiture,
                "startTime": null,
                "seconds": null,
                "combat": null,
                "turns": null,
                "startRound": null,
                "startTurn": null
            },
            type: "base",
            //@ts-ignore
            system: {
                "isStackable": false,
                "stacks": null
            },
            description: getAbilityDescription(item.system.description.value, "Character Regrowth"),
            origin: cancelRegrowthCaster.uuid,
            sort: 0,
            flags: {
                [MODULE_ID]: {
                    infusion_inv_remaining: infusedInvestiture,
                    start_turn_id: PRG.REGROWTH_INFUSION,
                }
            }
        };
        const regrowthInfusionEffect = await giveActorEffect(target.actor, regrowthInfusionEffectCreateData);
        cancelRegrowthCaster.setFlag(MODULE_ID, "descendantUuids", [regrowthInfusionEffect?.uuid!]);
    }
}
//#endregion
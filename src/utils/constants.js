//Module info
/**
 * String identifier for the module used throughout other scripts.
 */
export const MODULE_ID = 'cosmere-automated-actions';

/**
 * Full title string of the module.
 */
export const MODULE_NAME = 'Cosmere Automated Actions';

/**
 * String identifier for the system used throughout other scripts.
 */
export const SYSTEM_ID = 'cosmere-rpg';

export const OFFICIAL_MODULES = {
	worldguide: 'cosmere-rpg-stormlight-worldguide',
	handbook: 'cosmere-rpg-stormlight-handbook',
};

//todo: remove following constants from macros

//Actor Currency
export const spheresInfusedTotal = actor.system.currency.spheres.total.derived
export const spheresInfusedDenomination = actor.system.currency.spheres.denominations
export const spheresDunTotal = actor.system.currency.dun.total.derived
export const spheresDunDenomination = actor.system.currency.dun.denominations

//Actor Defenses
export const actorDefenseCog = actor.system.defenses.cog.derived
export const actorDefensePhy = actor.system.defenses.phy.derived
export const actorDefenseSpi = actor.system.defenses.spi.derived

//Actor Inventory

//Actor Effects
export const actorEffects = actor.effects

//Actor Resources
export const actorHealth = actor.system.resources.hea.value
export const actorHealthBonus = actor.system.resources.hea.bonus
export const actorHealthMax = actor.system.resources.hea.max.derived
export const actorHealthMaxBonus = actor.system.resources.hea.max.bonus
export const actorRecoveryDie = actor.system.recovery.die
export const actorInv = actor.system.resources.inv.value
export const actorInvBonus = actor.system.resources.inv.bonus
export const actorInvMax = actor.system.resources.inv.max.derived
export const actorInvMaxBonus = actor.system.resources.inv.max.bonus
export const actorFocus = actor.system.resources.foc.value
export const actorFocusBonus = actor.system.resources.fox.bonus
export const actorFocusMax = actor.system.resources.foc.max.derived
export const actorFocusMaxBonus = actor.system.resources.hea.max.bonus

//Actor Skills
export const actorAgility = actor.system.skills.agi
export const actorAthletics = actor.system.skills.ath
export const actorHeavyWeaponry = actor.system.skills.hwp
export const actorLightWeaponry = actor.system.skills.lwp
export const actorStealth = actor.system.skills.stl
export const actorThievery = actor.system.skills.thv

export const actorCrafting = actor.system.skills.cra
export const actorDeduction = actor.system.skills.ded
export const actorDiscipline = actor.system.skills.dis
export const actorIntimidation = actor.system.skills.inm
export const actorLore = actor.system.skills.lor
export const actorMedicine = actor.system.skills.med

export const actorDeception = actor.system.skills.dec
export const actorInsight = actor.system.skills.ins
export const actorLeadership = actor.system.skills.lea
export const actorPerception = actor.system.skills.prc
export const actorPersuasion = actor.system.skills.prs
export const actorSurvival = actor.system.skills.sur

export const actorAbrasion = actor.system.skills.abr
export const actorAdhesion = actor.system.skills.adh
export const actorCohesion = actor.system.skills.chs
export const actorDivision = actor.system.skills.dvs
export const actorGravitation = actor.system.skills.grv
export const actorIllumination = actor.system.skills.ill
export const actorProgression = actor.system.skills.prg
export const actorTension = actor.system.skills.tsn
export const actorTransformation = actor.system.skills.tsn
export const actorTransportation = actor.system.skills.trp

//Actor Movement
export const actorMovementWalk = actor.system.movement.walk.derived
export const actorMovementFly = actor.system.movement.fly.derived
export const actorMovementSwim = actor.system.movement.swim.derived

//Actor Misc
export const actorDeflect = actor.system.deflect.derived
export const actorExpertises = actor.system.expertises
export const actorInjuries = actor.system.injuries.derived
export const actorSkills = actor.system.skills
export const actorSenses = actor.system.senses.range.derived

//Actor Functions
export function getFirstTarget(){
    Array.from(game.user.targets)[0].actor.uuid
}
export function getAllTargets(){

}
export async function activateAllItemEffects(itemName){
    const item = actor.items.getName(itemName);
    const updates = item.effects.map(effect => ({ _id: effect.id, disabled: !effect.disabled }));
    await item.updateEmbeddedDocuments("ActiveEffect", updates);
}
export async function activateItemEffect(itemName, effectName){
    const effect = actor.items.getName(itemName).effects.getName(effectName);
    await effect.update({ disabled: !effect.disabled });
}
export async function surgeScalingDie(surgeSkill){
    switch(surgeSkill.rank){
            case 0:
                return "0"
                break;
            case 1:
                //small 2.5ft
                return "d4"
                break;
            case 2:
                //medium 5ft
                return "d6"
                break;
            case 3:
                //large 10ft
                return "d8"
                break;
            case 4:
                //huge 15ft
                return "d10"
                break;
            case 5:
                //gargantuan 20ft
                return "d12"
                break;
            default:
                console.warn(`Failed to grab Actor's rank in ${surgeSkill.attribute}`)
    }
}
export async function surgeScalingSize(rank){
 switch(surgeSkill.rank){
            case 0:
                return 0
                break;
            case 1:
                //small 2.5ft
                return 2.5
                break;
            case 2:
                //medium 5ft
                return 5
                break;
            case 3:
                //large 10ft
                return 10
                break;
            case 4:
                //huge 15ft
                return 15
                break;
            case 5:
                //gargantuan 20ft
                return 20
                break;
            default:
                console.warn(`Failed to grab Actor's rank in ${surgeSkill.attribute}`)
    }
}

//User Misc
export const target = game.user.targets.first();
export const targets = game.user.targets

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
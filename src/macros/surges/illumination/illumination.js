import { giveActorItem } from "../../../utils/helpers";
export async function illumination(item, actor){
    let illuminationDialog = await foundry.applications.api.DialogV2.wait({
        window: { title: "Illumination" },
        content: "<p>What would you like to lightweave?</p>",
        buttons: [
            {
                label: "Simple Illusion",
                action: "simple-illusion",
                callback: () => {
                    console.log("simple illusion, currently no functionality");
                }
            },
            {
                label: "Complex Illusion",
                action: "complex-illusion",
                callback: async () => {
                    //adds "Dismiss Complex Illusion" item to actor
                    const dismissComplexIllusionUUID = "Compendium.cosmere-automated-actions.caaactions.Item.EZqaHREQyTkBiRIb"
                    const dismissComplexIllusion = await giveActorItem(actor, dismissLashingUUID)
                }
            },
            {
                label: "Disguise Yourself",
                action: "disguise-yourself",
                callback: async () => {
                    //adds "Dismiss Disguise" item to actor
                    const dismissDisguiseUUID = "Compendium.cosmere-automated-actions.caaactions.Item.3SdIMgwufXgAfQmM"
                    const dismissDisguise = await giveActorItem(actor, dismissDisguiseUUID)
                }
            }
        ]
    })
    illuminationDialog;
    
}

export function dismissComplexIllusion(item){
    item.delete()
}
export function dismissDisguise(item){
    item.delete()
}

function complexIllusionRound(item, actor){
    const actorInv = actor.system.resources.inv.value;
    if(actorInv < 1){
            dismissComplexIllusion(item);
            return;
        }
        const newInv = actorInv - 1;
        caster.update({ 'system.resources.inv.value': newInv });
}

Hooks.on('combatTurnChange', (cosmereCombat) => {
    //loops through combatants looking for "Dismiss Complex Illusion" item, executing each ones round macro
    cosmereCombat.turns.forEach((combatant)=>{
        if(!combatant.defeated){
            const actor = game.actors.get(combatant.actorId);
            if (actor.items.getName("Dismiss Complex Illusion")){
                const item = actor.items.getName("Dismiss Complex Illusion");
                complexIllusionRound(item, actor);
            }
        }
    })

})
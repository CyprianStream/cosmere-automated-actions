
export async function gravitation(item, actor){
    const target = game.user.targets.first();
    await foundry.applications.api.DialogV2.wait({
        window: { title: "Gravitation" },
        content: "<p>Which would you like to target?</p>",
        buttons: 
        [{
            label: "Character",
            action: "character",
            callback: async () => {
                console.log(target.document.disposition)
                if(!target){
                    ui.notifications.warn("Needs target");
                    return;
                } else if(target.document.disposition === -1){
                    //Perform a gravitation test against physical defense
                    let roll = await actor.rollSkill("grv")
                    console.log(roll)
                    console.log(target.actor.system.defenses.phy.value)
                    if(roll < target.actor.system.defenses.phy.value){
                        return
                    }
                    //If roll fails, return
                }
                    //Adds "Dismiss Lashing" to user
                    const dismissLashing = fromUuid("Compendium.cosmere-automated-actions.caaactions.Item.TcddNgIyb1GGZGXn");
                    const dismissLashingItem = await game.items.fromCompendium(dismissLashing);
                    console.log(dismissLashing)
                    const dismissLashingActorItem = await actor.createEmbeddedDocuments("Item", [dismissLashingItem]);
                    const actorItem = dismissLashingActorItem[0]
                    console.log(actorItem)
                    actorItem.setFlag("world", "target", target.actor.uuid);
                
                
            }
        },
        {
            label: "Object",
            action: "object",
            callback: async () => {
                const dismissLashing = fromUuid("Compendium.cosmere-automated-actions.caaactions.Item.TcddNgIyb1GGZGXn");
                const dismissLashingItem = await game.items.fromCompendium(dismissLashing);
                console.log(dismissLashing)
                const dismissLashingActorItem = await actor.createEmbeddedDocuments("Item", [dismissLashingItem]);
                const actorItem = dismissLashingActorItem[0]
                console.log(actorItem)
                actorItem.setFlag("world", "target", "item");
            }
        }]
    })
}
export function dismissLashing(item){
    item.delete()
}

export async function gravitationRound(item){
    const actor = item.actor
    const actorInv = actor.system.resources.inv.value
        if(actorInv < 1){
            dismissLashing(item)
            return
        }
        const newInv = actorInv - 1
        await actor.update({ 'system.resources.inv.value': newInv })
}

Hooks.on('combatTurnChange', (cosmereCombat) => {
    //loops through combatants looking for "Dismiss Lashing" item, executing each ones macro
    console.log("new turn")
    cosmereCombat.turns.forEach((combatant)=>{
        if(!combatant.defeated){
            const actor = game.actors.get(combatant.actorId)
            if(actor.items.getName("Dismiss Lashing")){
                const item = actor.items.getName("Dismiss Lashing")
                gravitationRound(item)
            }
        }
    })

})
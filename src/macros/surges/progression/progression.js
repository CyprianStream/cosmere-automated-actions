export async function progression(item, actor){
    const target = game.user.targets.first();
    const actorProgressionRank = actor.system.skills.prg.rank;
    await foundry.applications.api.DialogV2.wait({
        window: { title: "Progression" },
        content: "<p>Which skill would you like to use?</p>",
        buttons: 
        [{
            label: "Plant Growth",
            action: "plant growth",
            callback: async () => {
                const sizes = {
                    small: { width: 1, height: 1, "texture.scaleX": 0.75, "texture.scaleY": 0.75 },
                    medium: { width: 1, height: 1, "texture.scaleX": 1, "texture.scaleY": 1 },
                    large: { width: 2, height: 2, "texture.scaleX": 1, "texture.scaleY": 1 },
                    huge: { width: 3, height: 3, "texture.scaleX": 1, "texture.scaleY": 1 },
                    gargantuan: { width: 4, height: 4, "texture.scaleX": 1, "texture.scaleY": 1 },
                };
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
                if(target){
                    //TODO Find way to update scale as well as width+height
                    await target.document.update(sizes[plantGrowthDialog])
                };
            }
        },
        {
            label: "Character Regrowth",
            action: "character regrowth",
            callback: async () => {
                const caster = actor
                if(!target){
                    ui.notifications.warn("Needs target");
                    return;
                }
                const characterRegrowth = 1;
                //Adds "Cancel Regrowth Infusion" item to target
                const cancelRegrowthInfusion = fromUuid("Compendium.world.caa-items.Item.0gVCbh8s8mKo5X0c");
                const cancelRegrowthInfusionItem = await game.items.fromCompendium(cancelRegrowthInfusion);
                cancelRegrowthInfusionItem.setFlag("world", "target", target.actor.uuid);
                cancelRegrowthInfusionItem.setFlag("world", "caster", caster.uuid);
                actor.createEmbeddedDocuments("Item", [cancelRegrowthInfusionItem]);
                //Adds "Cancel Regrowth" item to caster
                const cancelCharacterRegrowth = fromUuid("Compendium.world.caa-items.Item.4vJ2HCi2G6Wh1KF6");
                const cancelCharacterRegrowthItem = await game.items.fromCompendium(cancelCharacterRegrowth);
                cancelCharacterRegrowthItem.setFlag("world", "target", target.actor.uuid);
                cancelCharacterRegrowthItem.setFlag("world", "caster", caster.uuid);
                target.actor.createEmbeddedDocuments("Item", [cancelCharacterRegrowthItem]);
            }
        }]
    })
};

export async function cancelCharacterRegrowth(item, actor){
    //grabs target and caster from item flags
    const targetUUID = item.getFlag("world", "target");
    const target = await fromUuid(targetUUID)
    const casterUUID = item.getFlag("world", "caster");
    const caster = await fromUuid(casterUUID)
    //finds items from target and caster and deletes it
    const targetItem = await target.items.getName("Cancel Character Regrowth")
    const casterItem = await caster.items.getName("Cancel Regrowth Infusion")
    targetItem.delete()
    casterItem.delete()
}

Hooks.on('combatTurnChange', (cosmereCombat) => {
    //loops through combatants looking for "Cancel Character Regrowth" item, executing each ones macro
    cosmereCombat.turns.forEach((combatant)=>{
        if(!combatant.defeated){
            const actor = game.actors.get(combatant.actorId)
            if(actor.items.getName("Cancel Character Regrowth")){
                const item = actor.items.getName("Cancel Character Regrowth")
                characterRegrowthRound(item)
            }
        }
    })

})

export async function characterRegrowthRound(item){
    //grabs target and caster from item flags
    const targetUUID = item.getFlag("world", "target");
    const target = await fromUuid(targetUUID)
    const casterUUID = item.getFlag("world", "caster");
    const caster = await fromUuid(casterUUID)

    //drain stormlight from caster, ends effect if there isn't enough stormlight left
    const casterInv = caster.system.resources.inv.value
    if(casterInv < 1){
        cancelCharacterRegrowth(item, target)
        return
    }
    const newInv = casterInv - 1
    caster.update({ 'system.resources.inv.value': newInv })

    //heals target
    const rollData = caster.getRollData()
    console.log(rollData)
    let r = await new Roll("@scalar.power.prg.die", rollData).evaluate()
    await r.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: caster }),
        flavor: `${caster.name} heals ${target.name} a little`,
    })
    const targetHealth = target.system.resources.hea.value
    const newHealth = targetHealth + r.total
    target.update({ 'system.resources.hea.value': newHealth })
}
export async function division(item, actor){
    const target = game.user.targets.first();
    const actorDivisionRank = actor.system.skills.dvs.rank;
    //prompt user for target mode
    let divisionDialog = await foundry.applications.api.DialogV2.wait({
        window: { title: "Division" },
        content: "<p>What would you like to target?</p>",
        buttons: [
            {
                label: "Character",
                action: "character",
                callback: async () => {
                    const currentInv = actor.system.resources.inv.value
                    if(!target){
                        ui.notifications.warn("Needs target");
                        const newInv = currentInv + 1
                        actor.update({ 'system.resources.inv.value': newInv })
                        return;
                    }
                    //TODO make this into a system attack roll instead of basic foundry roll
                    //makes attack roll against spiritual defense
                    const rollData = actor.getRollData()
                    const targetSpiritDefense = target.actor.system.defenses.spi.value
                    console.log(targetSpiritDefense)
                    let attackRoll = await new Roll("1d20 + @skills.dvs.mod", rollData).evaluate()
                    await attackRoll.toMessage({
                        speaker: ChatMessage.getSpeaker({ actor: actor }),
                        flavor: `${actor.name} rolls to hit ${target.name}`,
                    })
                    if(attackRoll.total >= targetSpiritDefense){
                        //rolls damage
                        let r = await new Roll("3@scalar.power.dvs.die", rollData).evaluate()
                        const targetHealth = target.actor.system.resources.hea.value
                        const newHealth = targetHealth - r.total
                        target.actor.update({ 'system.resources.hea.value': newHealth })            
                        await r.toMessage({
                            speaker: ChatMessage.getSpeaker({ actor: actor }),
                            flavor: `${target.name} burns away a little...`,
                        })
                    }
                }
                
            },
            {
                label: "Area",
                action: "area",
                callback: async () => {
                    const currentInv = actor.system.resources.inv.value
                    const infusionCost = {
                        gargantuan: 4,
                        huge:3,
                        large:2,
                        medium:1,
                        small:0
                    }
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
                    }
                    const divisionAreaDialog = await foundry.applications.api.DialogV2.wait({
                        window:{ title: "Division"},
                        content: "How large is your target area?",
                        buttons: divisionAreaButtons
                    })
                    const areaSize = divisionAreaDialog
                    let newInv = currentInv - infusionCost[areaSize]
                    if(newInv >= 0){
                        actor.update({ 'system.resources.inv.value': newInv })
                        const chatMessageData = {
                            author: game.user,
                            speaker: ChatMessage.getSpeaker({ actor }),
                            content: `${actor.name} uses division on a ${areaSize} object or area`,    
                        }
                    await getDocumentClass("ChatMessage").create(chatMessageData)
                    } else {
                        newInv = currentInv + 1
                        ui.notifications.warn("Not enough investiture for infusion of that size");
                        actor.update({ 'system.resources.inv.value': newInv })
                    }
                    
                    
                }
            }
        ]
    })
    divisionDialog;
}
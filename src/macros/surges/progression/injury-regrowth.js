
export async function injuryRegrowth(item, actor){
    const target = game.user.targets.first();
    if(!target){
        ui.notifications.warn("Needs target");
        return;
    }
    const injuries = target.actor.items.filter(item => item.type === "injury")
    const injuryRegrowthButtons = []
    injuries.forEach(injury => {
        const injuryItem = injury
        if(injury.system.type === "permanent_injury"){
            const buttonLabel = injury.name + " (-1 inv)"
            injuryRegrowthButtons.push({ 
                label: buttonLabel,
                action: injury.uuid,
                callback: async () => {
                    console.log(actorInv)
                    if(actorInv < 1){
                        const newValue = actorInv + 2
                        ui.notifications.warn("Not enough Investiture to heal a Permanant Injury");
                        await actor.update({ 'system.resources.inv.value': newValue });
                        return;
                    }
                    const newValue = actorInv - 1
                    await actor.update({ 'system.resources.inv.value': newValue });
                    injuryItem.delete()
                }
            })
            console.log("Added permanent injury")
        } else if (injury.system.type === "death") {
            return
        } else {
            injuryRegrowthButtons.push({ 
                label: injury.name,
                action: injury.uuid,
                callback: () => {
                    injuryItem.delete()
                }
            })
            console.log("Added non permanant injury")
        }
    });
    let dialogWindow = await foundry.applications.api.DialogV2.wait({
        window: { title: "Injury Regrowth" },
        content: "<p>What would you like to heal?</p>",
        buttons: injuryRegrowthButtons
    })
    dialogWindow
}
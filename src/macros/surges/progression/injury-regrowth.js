import { getFirstTarget } from "../../../utils/helpers";

export async function injuryRegrowth(item, actor){
    const target = getFirstTarget();
    if(!target){
        ui.notifications.warn("Needs target");
        return;
    }
    //Creates a list of buttons for each injury on a target
    const injuries = target.actor.items.filter(item => item.type === "injury");
    const injuryRegrowthButtons = [];
    injuries.forEach(injury => {
        const injuryItem = injury;
        if(injury.system.type === "permanent_injury"){
            //Raise cost of permanent injuries by 1 investiture
            const actorInv = actor.system.resources.inv.value;
            const buttonLabel = injury.name + " (-1 inv)";
            injuryRegrowthButtons.push({ 
                label: buttonLabel,
                action: injury.uuid,
                callback: async () => {
                    //If actor can't afford to heal a permanent injury, refund spent investiture and send error
                    if(actorInv < 1){
                        const newValue = actorInv + 2;
                        ui.notifications.warn("Not enough Investiture to heal a Permanant Injury");
                        await actor.update({ 'system.resources.inv.value': newValue });
                        return;
                    }
                    const newValue = actorInv - 1;
                    await actor.update({ 'system.resources.inv.value': newValue });
                    injuryItem.delete();
                }
            })
            //If injury is death, skip it
        } else if (injury.system.type === "death") {
            return
        } else {
            injuryRegrowthButtons.push({ 
                label: injury.name,
                action: injury.uuid,
                callback: () => {
                    injuryItem.delete();
                }
            })
            console.log("Added non permanant injury");
        }
    });
    //If target has no injuries, cancel
    if(injuryRegrowthButtons.length === 0){
        ui.notifications.warn("No possible injuries to heal");
        return
    }
    await foundry.applications.api.DialogV2.wait({
        window: { title: "Injury Regrowth" },
        content: "<p>What would you like to heal?</p>",
        buttons: injuryRegrowthButtons
    })
}
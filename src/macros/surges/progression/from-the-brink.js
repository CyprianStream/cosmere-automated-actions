
export async function fromTheBrink(item, actor){
    const target = game.user.targets.first();
    if (target.actor.system.resources.hea.value > 0){
        console.log("Attempting to revive a healthy character!");
        return;
    }
    target.actor.toggleStatusEffect("unconscious", {active: true});
    target.actor.toggleStatusEffect("dead", {active: false});
    target.actor.update({"system.resources.hea.value": 0})
}

export async function fromTheBrink(item, actor){
    const target = game.user.targets.first();
    target.actor.toggleCondition("unconcious", {active: true});
    target.actor.toggleCondition("dead", {active: false});
    target.actor.system.resources.hea.value = 0
}

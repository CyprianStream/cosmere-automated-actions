import { CosmereActor, CosmereItem } from "@src/declarations/cosmere-rpg/documents"
//TODO: Create new shared "roll recovery die" function as a helper
export async function recover(item: CosmereItem, actor: CosmereActor<CharacterActorDataModel>){
    let r = new Roll("1" + actor.system.recovery.die.value, actor.getRollData());
    await r.evaluate();
    r.toMessage();
    let result = r.total;
    if(actor.system.resources.hea.value == actor.system.resources.hea.max.value){
        // If health is max, only add to focus
        actor.update({'system.resources.foc.value': actor.system.resources.foc.value + result!} as any);
    }
    else if(actor.system.resources.foc.value == actor.system.resources.foc.max.value){
        // If focus is max, only add to health
        actor.update({'system.resources.hea.value': actor.system.resources.hea.value + result!} as any);
    }
    //TODO: Make prompt for dividing up health/focus restoration
    actor.update({'system.resources.hea.value': actor.system.resources.hea.value + result!} as any);
}
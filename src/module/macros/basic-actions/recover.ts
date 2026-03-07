import { CosmereActor, CosmereItem } from "@src/declarations/cosmere-rpg/documents"
import { RecoverPrompt } from "@src/module/applications/prompts/recover";
import { log } from "@module/utils/helpers";
//TODO: Create new shared "roll recovery die" function as a helper
export async function recover(item: CosmereItem, actor: CosmereActor<CharacterActorDataModel>){
    log("Running recover macro");
    let r = new Roll("1" + actor.system.recovery.die.value, actor.getRollData());
    await r.evaluate();
    r.toMessage();
    let result = r.total!;
    let healthMissing = actor.system.resources.hea.max.value - actor.system.resources.hea.value;
    let focusMissing = actor.system.resources.foc.max.value - actor.system.resources.foc.value;
    if(healthMissing == 0){
        // If health is max, only add to focus
        actor.update({'system.resources.foc.value': actor.system.resources.foc.value + result} as any);
    }
    else if(focusMissing == 0){
        // If focus is max, only add to health
        actor.update({'system.resources.hea.value': actor.system.resources.hea.value + result} as any);
    }
    else if (result >= healthMissing + focusMissing){
        actor.update({
            'system.resources.hea.value': actor.system.resources.hea.max.value,
            'system.resources.foc.value': actor.system.resources.foc.max.value
        } as any );
    }
    else{
        let gained = await RecoverPrompt.prompt(actor, result);
        let actorUpdateData = {
            'system.resources.hea.value': actor.system.resources.hea.value + gained.hea,
            'system.resources.foc.value': actor.system.resources.foc.value + gained.foc,
        };
        actor.update(actorUpdateData as any);
    }

}
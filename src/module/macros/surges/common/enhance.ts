import { CosmereItem, CosmereActor, CosmereActiveEffect } from "@system/documents";
import { log } from "@module/utils/helpers.js";

export async function enhance(item: CosmereItem, actor: CosmereActor) {
	// activateAllItemEffects(item);
	// This is now handled natively by the system
}

export async function enhanceEndTurnItem(item: CosmereItem, actor: CosmereActor, turn: Combat.HistoryData){
	let enhanceEffects = item.transferredEffects;
	let enhanceActive = false;
	for(const effect of enhanceEffects)
	{
		log(`Checking if effect is active: ${effect.active}`);
		log(effect);
		enhanceActive = enhanceActive || effect.active;
	}
	if(!enhanceActive){
		return;
	}
	log(`We think effect is definitely active`);
	//Check if we have the second ideal goal at level 3 or higher, in which case, don't expend investiture
	//@ts-ignore
	if(actor.items.filter(x => x.name == 'Speak the Second Ideal' && x.type == 'goal')[0]?.system.level == 3){
		return;
	}

	if(actor.system.resources.inv.value > 0){
		//TODO: Prompt the character if they want to spend investiture to continue enhance
        actor.update({ 'system.resources.inv.value': actor.system.resources.inv.value-1 } as any);
	}
	else{
		cancelEnhance(item);
	}

}

async function cancelEnhance(item: CosmereItem){
	for(const effect of item.transferredEffects){
		await effect.update({disabled:true});
	}
}
//Module Functions
export function IsModuleActive(moduleId) {
	return game.modules.get(moduleId)?.active;
}

export function nameToId(str) {
    return str.toLowerCase().split(' ').join('-');
}

//Actor Functions
export function getFirstTarget(){
    Array.from(game.user.targets)[0].actor.uuid
}
export function getAllTargets(){

}

//Item Functions
export async function activateAllItemEffects(item){
    const updates = item.effects.map(effect => ({ _id: effect.id, disabled: !effect.disabled }));
    await item.updateEmbeddedDocuments("ActiveEffect", updates);
}
export async function activateItemEffect(itemName, effectName){
    const effect = actor.items.getName(itemName).effects.getName(effectName);
    await effect.update({ disabled: !effect.disabled });
}
export async function giveActorItem(actor, itemUUID){
    const itemId = await fromUuid(itemUUID);
    const item = await Item.create(itemId.toObject(), { parent: actor });
    return item
}
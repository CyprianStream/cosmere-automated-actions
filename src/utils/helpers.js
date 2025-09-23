//Module Functions
export function IsModuleActive(moduleId) {
	return game.modules.get(moduleId)?.active;
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

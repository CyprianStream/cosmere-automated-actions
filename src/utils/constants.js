//Module info
/**
 * String identifier for the module used throughout other scripts.
 */
export const MODULE_ID = 'cosmere-automated-actions';

/**
 * Full title string of the module.
 */
export const MODULE_NAME = 'Cosmere Automated Actions';

/**
 * String identifier for the system used throughout other scripts.
 */
export const SYSTEM_ID = 'cosmere-rpg';

export const OFFICIAL_MODULES = {
	worldguide: 'cosmere-rpg-stormlight-worldguide',
	handbook: 'cosmere-rpg-stormlight-handbook',
};

//Actor Functions
export function getFirstTarget(){
    Array.from(game.user.targets)[0].actor.uuid
}
export function getAllTargets(){

}
export async function activateAllItemEffects(item){
    const updates = item.effects.map(effect => ({ _id: effect.id, disabled: !effect.disabled }));
    await item.updateEmbeddedDocuments("ActiveEffect", updates);
}
export async function activateItemEffect(itemName, effectName){
    const effect = actor.items.getName(itemName).effects.getName(effectName);
    await effect.update({ disabled: !effect.disabled });
}
export async function surgeScalingDie(surgeSkill){
    switch(surgeSkill.rank){
		case 0:
			return "0";
		case 1:
			//small 2.5ft
			return "d4";
            case 2:
                //medium 5ft
			return "d6";
            case 3:
                //large 10ft
			return "d8";
		case 4:
			//huge 15ft
			return "d10";
		case 5:
			//gargantuan 20ft
			return "d12";
		default:
			console.warn(`Failed to grab Actor's rank in ${surgeSkill.attribute}`);
    }
}
export async function surgeScalingSize(rank){
 switch(surgeSkill.rank){
	 case 0:
		 return 0;
            case 1:
                //small 2.5ft
                return 2.5;
            case 2:
                //medium 5ft
                return 5;
            case 3:
                //large 10ft
                return 10;
            case 4:
                //huge 15ft
                return 15;
            case 5:
                //gargantuan 20ft
                return 20;
	 default:
		 console.warn(`Failed to grab Actor's rank in ${surgeSkill.attribute}`);
    }
}

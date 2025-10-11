/*
To lightweave an illusion, spend 1 investiture or more to infuse it into thin air in a space within your spren bond range,
This illusion can't exceed the surge size for your ranks in illumination

Lightweavings typically take the form of a threedimentional hologram representing a character, object, or phenomenon you're familiar with.
This illusion is composed of light, complete with animation and accompanying sounds produced by the vibrations of your bonded spred

SIMPLE AND COMPLEX ILLUSIONS
If the illusion depicts a simple object with no sound or animations, the infusion uses 1 investiture every 10 minutes.
If the illusion depicts a character or more complex object, it instead uses 1 investiture each round. For the duration, the illusion remains active ecen if you move out of range. You can moce and control a complex illusion, as detailed in controlling illusions.

DISGUISING YOURSELF
Alternatively, if you have 1 investiture or more, you can use illumination to create an illusory disguise on yourself without spending Investiture.
This disguide lasts until you end it as a free action, or run out of investiture.

DECEIVING CHARACTERS
If your illusion depicts a simple object or a disguise on yourself, it automatically convinces characters unless they have a reason to be suspicious.
If you create a more complex illusion(such as disguising another character), the GM might require you to make an illumination test against the Cognitive Defense of any character who passively observes the illusion; on a success, your illusion is convincing to them.

A character might decide to use a skill to scrutinize your illusion, especially if you fail the above Illumination test or if you or your allies
roll a Complication on a related test. In this case, make an Illumination tesst opposed by the character's perception test.
If their test result exceeds your own, they notice the illusion. (See Detecting Illusions for the effects)

You can make these tests to decieve characters even if that illusion is currently out of your spren bond range.
*/

export async function illumination(item, actor){
    let illuminationDialog = await foundry.applications.api.DialogV2.wait({
        window: { title: "Illumination" },
        content: "<p>What would you like to lightweave?</p>",
        buttons: [
            {
                label: "Simple Illusion",
                action: "simple-illusion",
                callback: () => {
                    console.log("simple illusion");
                }
            },
            {
                label: "Complex Illusion",
                action: "complex-illusion",
                callback: async () => {
                    console.log("complex illusion");
                    const dismissComplexIllusion = fromUuid("Compendium.world.caa-items.Item.89FozEmV2EO0mwLn");
                    const dismissComplexIllusionItem = await game.items.fromCompendium(dismissComplexIllusion);
                    actor.createEmbeddedDocuments("Item", [dismissComplexIllusionItem]);
                }
            },
            {
                label: "Disguise Yourself",
                action: "disguise-yourself",
                callback: async () => {
                    console.log("disguise yourself");
                    const dismissDisguise = fromUuid("Compendium.world.caa-items.Item.G7s1hu71XYPZqtMZ");
                    const dismissDisguiseItem = await game.items.fromCompendium(dismissDisguise);
                    actor.createEmbeddedDocuments("Item", [dismissDisguiseItem]);
                }
            }
        ]
    })
    illuminationDialog;
    
}

export function dismissComplexIllusion(item){
    item.delete()
}
export function dismissDisguise(item){
    item.delete()
}

function complexIllusionRound(item, actor){
    const actorInv = actor.system.resources.inv.value;
    if(actorInv < 1){
            dismissComplexIllusion(item);
            return;
        }
        const newInv = actorInv - 1;
        caster.update({ 'system.resources.inv.value': newInv });
}

Hooks.on('combatTurnChange', (cosmereCombat) => {
    //loops through combatants looking for "Dismiss Complex Illusion" item, executing each ones round macro
    cosmereCombat.turns.forEach((combatant)=>{
        if(!combatant.defeated){
            const actor = game.actors.get(combatant.actorId);
            if (actor.items.getName("Dismiss Complex Illusion")){
                const item = actor.items.getName("Dismiss Complex Illusion");
                complexIllusionRound(item, actor);
            }
        }
    })

})
export async function disquiet(item, actor){
    const target = game.user.targets.first();
    let newValue = 0
    const startFocus = target.actor.system.resources.foc.value
    let dialogWindow = new Dialog({
        title: "Disquiet",
        content: "<p>Do you know one of the target's goals?</p>",
        buttons: {
            one: {
                icon: '<i class="fas fa-check"></i>',
                label: "Yes (1d4 focus)",
                callback: async() => {
                    let r = await new Roll("1d4").evaluate()
                    await r.toMessage({
                        speaker: ChatMessage.getSpeaker({ actor: actor }),
                        flavor: `${target.actor.name} loses focus`,
                    })
                    newValue = startFocus - r.total
                    if(newValue < 0){
                        newValue = 0
                    }
                    await target.actor.update({"system.resources.foc.value": newValue})
                }
            },
            two: {
                icon: '<i class="fas fa-times"></i>',
                label: "No (1 focus)",
                callback: async () => {
                    newValue = startFocus - 1
                    if(newValue < 0){
                        newValue = 0
                    }
                    await target.actor.update({"system.resources.foc.value": newValue})                
                }
            }
        },
        default: "two",
    });
    dialogWindow.render(true);
}
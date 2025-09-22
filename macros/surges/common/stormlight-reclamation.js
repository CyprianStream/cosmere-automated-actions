
export async function stormlightReclamation(value){
    //create popup to ask "how much stormlight do you reclaim"
    actor.update({ 'system.resources.inv.value': value})
}
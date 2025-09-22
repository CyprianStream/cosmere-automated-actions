
export function stormlightReclamation(item, actor) {
	//create popup to ask "how much stormlight do you reclaim"
	// for now we'll just make a var that's set to 1;
	var value = 1;
	var newValue = actor.system.resources.inv.value
	if (newValue > actor.system.resources.inv.max.value){ newValue = actor.system.resources.inv.max.value}
	actor.update({ 'system.resources.inv.value': value })
}

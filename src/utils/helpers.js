export function IsModuleActive(moduleId) {
	return game.modules.get(moduleId)?.active;
}
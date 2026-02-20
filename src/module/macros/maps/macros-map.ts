//Abrasion actions


//Adhesion actions


//Cohesion actions


//Division actions
import { division } from "../surges/division/division.js"

//Graviatation actions


//Illumination actions


//Progression actions


//Tension actions


//Transformation actions


//Transportation actions


//Adversary actions


//Adversary features


//Adversary stormlight actions and features


//Adversary strikes


//Adversary unique
import { disquiet } from "../adversary-features/actions/disquiet.js"
import { MacroFunc } from "../index.js"

//Basic Macros

export var macrosMap: Map<string, MacroFunc> = new Map<string, MacroFunc>([
	//Common stormlight actions

	//Abrasion actions


	//Adhesion actions


	//Cohesion actions


	//Division actions
	["division", division as MacroFunc],


	//Graviatation actions


	//Illumination actions


	//Progression actions


	//Tension actions


	//Transformation actions


	//Transportation actions


	//Adversary actions


	//Adversary features


	//Adversary stormlight actions and features


	//Adversary strikes


	//Adversary unique
	["disquiet", disquiet as MacroFunc],

	//Basic Macros
]);
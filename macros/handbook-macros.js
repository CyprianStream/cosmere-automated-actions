//common stormlight actions
import { breatheStormlight } from "./surges/common/breathe-stormlight.js"
import { enhance } from "./surges/common/enhance.js"
import { stormlightReclamation } from "./surges/common/stormlight-reclamation.js"


//Abrasion actions


//Adhesion actions


//Cohesion actions


//Division actions


//Graviatation actions


//Illumination actions


//Progression actions
import { explosiveGrowth } from "./surges/progression/explosive-growth.js"
import { fromTheBrink } from "./surges/progression/from-the-brink.js"
import { injuryRegrowth } from "./surges/progression/injury-regrowth.js"
import { progression } from "./surges/progression/progression.js"


//Tension actions


//Transformation actions


//Transportation actions





export const handbookMacros = {
    //common stormlight actions
    breathe_stormlight: breatheStormlight(),
    enhance: enhance(),
    stormlight_reclamation: stormlightReclamation(),

    //Abrasion actions


    //Adhesion actions


    //Cohesion actions


    //Division actions


    //Graviatation actions


    //Illumination actions


    //Progression actions
    explosive_growth: explosiveGrowth(),
    from_the_brink: fromTheBrink(),
    injury_regrowth: injuryRegrowth(),
    progression: progression()

    //Tension actions


    //Transformation actions


    //Transportation actions
} 
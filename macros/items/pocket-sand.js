import { getAllTargets, getFirstTarget } from "../utils";

//checks if user has a token targeted
if (!getAllTargets()){return}

export async function pocketSand(){
    //uses dfreds effects panel to add the effect "Sand in eyes" to targeted user
    game.dfreds.effectInterface.addEffect({ effectName: 'Sand in Eyes', uuid: getFirstTarget() } )
}
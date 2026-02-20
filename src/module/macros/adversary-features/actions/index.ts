import { ADV_ACT } from "./talent-ids";
import { MacroDefinition, registerMacroDefinition } from "@module/macros";
import { log } from "@module/utils/helpers";
import { disquiet } from "./disquiet";

const adversaryActionsDefinition: MacroDefinition = {
    macros: [
        {id: ADV_ACT.DISQUIET, funcSignature: disquiet}
    ],
}

export function registerAdversaryActionsDefinitions(){
    log("CAA | Registering adversary actions Macros");
    registerMacroDefinition(adversaryActionsDefinition);
}
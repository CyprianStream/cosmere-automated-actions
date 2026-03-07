import { BASIC } from "./action-ids";
import { MacroDefinition, registerMacroDefinition } from "@module/macros";
import { log } from "@module/utils/helpers";
import { recover } from "./recover";

const recoverDefinition: MacroDefinition = {
    macros: [
        //@ts-ignore
        {id: BASIC.RECOVER, funcSignature: recover}
    ],
}

export function registerBasicActionDefinitions(){
    log("CAA | Registering Basic Action Macros");
    registerMacroDefinition(recoverDefinition);
}
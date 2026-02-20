import { DVS } from "./talent-ids";
import { MacroDefinition, registerMacroDefinition } from "../..";
import { log } from "@module/utils/helpers";
import { division } from "./division";

const DivisionDefinition: MacroDefinition = {
    macros: [
        {id: DVS.DVS_ITEM, funcSignature: division}
    ],
}

export function registerDivisionDefinitions(){
    log("CAA | Registering Division Macros");
    registerMacroDefinition(DivisionDefinition);
}
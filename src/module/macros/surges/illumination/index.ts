import { ILL } from "./talent-ids";
import { MacroDefinition, registerMacroDefinition } from "../..";
import { log } from "@module/utils/helpers";
import { cancelComplexIllusion, cancelDisguise, complexIllusionTurnStart, illumination } from "./illumination";

const illuminationDefinition: MacroDefinition = {
    macros: [
        {id: ILL.ILL_ITEM, funcSignature: illumination},
        {id: ILL.CANCEL_COMPLEX_ILLUSION, funcSignature: cancelComplexIllusion},
        {id: ILL.CANCEL_DISGUISE, funcSignature: cancelDisguise}
    ],
    startTurnItem: {id: ILL.CANCEL_COMPLEX_ILLUSION, funcSignature: complexIllusionTurnStart},
}

export function registerIlluminationDefinitions(){
    log("CAA | Registering Illumination Macros");
    registerMacroDefinition(illuminationDefinition);
}
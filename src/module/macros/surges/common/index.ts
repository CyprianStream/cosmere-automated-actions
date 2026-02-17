import { MacroDefinition, registerMacroDefinition } from "../..";
import { log } from "@module/utils/helpers";
import { STRM } from "./talent-ids";
import { enhanceEndTurnItem } from "./enhance";
import { breatheStormlight } from "./breathe-stormlight";
import { stormlightReclamation } from "./stormlight-reclamation";

const enhanceDefinition: MacroDefinition = {
    endTurnItem: {id: STRM.ENHANCE, funcSignature: enhanceEndTurnItem},
}

const breatheStormlightDefinition: MacroDefinition = {
    macros: [
        {id: STRM.BREATHE_STORMLIGHT, funcSignature: breatheStormlight}
    ]
}

const stormlightReclamationDefinition: MacroDefinition = {
    macros: [
        {id: STRM.STORMLIGHT_RECLAMATION, funcSignature: stormlightReclamation}
    ]
}

export function registerCommonStormlightDefinitions(){
    log("CAA | Registering Common Stormlight Macros");
    registerMacroDefinition(enhanceDefinition);
    registerMacroDefinition(breatheStormlightDefinition);
    registerMacroDefinition(stormlightReclamationDefinition);
}
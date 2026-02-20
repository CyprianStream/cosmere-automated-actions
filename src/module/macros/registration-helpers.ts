import { registerAbrasionDefinitions } from "./surges/abrasion";
import { registerCommonStormlightDefinitions } from "./surges/common";
import { registerDivisionDefinitions } from "./surges/division";
import { registerGravitationDefinitions } from "./surges/gravitation";
import { registerIlluminationDefinitions } from "./surges/illumination";
import { registerProgressionDefinitions } from "./surges/progression";

export function registerAllMacros(){
    registerCommonStormlightDefinitions();

    //Surges
    registerAbrasionDefinitions();
    registerDivisionDefinitions();
    registerGravitationDefinitions();
    registerIlluminationDefinitions();
    registerProgressionDefinitions();
}
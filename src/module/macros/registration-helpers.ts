import { registerAbrasionDefinitions } from "./surges/abrasion";
import { registerCommonStormlightDefinitions } from "./surges/common";
import { registerGravitationDefinitions } from "./surges/gravitation";
import { registerProgressionDefinitions } from "./surges/progression";

export function registerAllMacros(){
    registerCommonStormlightDefinitions();
    registerAbrasionDefinitions();
    registerGravitationDefinitions();
    registerProgressionDefinitions();
}
export async function hookRan(hookName: Hooks.HookName){
    console.log(`Test waiting on hook: ${hookName}`);
    return new Promise<boolean>((resolve, reject) => {
        let hookId = Hooks.on(hookName, (
            ...hookArgs: any[]
        ) => {
            console.log("Hook resolved with args:");
            console.log(hookArgs);
            resolve(true);
            Hooks.off(hookName, hookId);
        });
        setTimeout(function() {
            Hooks.off(hookName, hookId);
            resolve(false);
        }, 10);
    });
}

export async function hookRanAfterCall(hookName: Hooks.HookName, fn: Function, ...args: any){
    let hookRanPromise = hookRan(hookName);
    fn(args);
    return hookRanPromise;
}

export interface ParamWithProperty {
    paramExpectedIndex: number,
    properties: Array<
        {
            key: string,
            value?: any,
        }
    >
}

export async function hookRanWithParamWithProperty(hookName: Hooks.HookName, params: ParamWithProperty[]){
    console.log(`Test waiting on hook: ${hookName} with params:`);
    console.log(params);
    return new Promise<boolean>((resolve, reject) => {
        let hookId = Hooks.on(hookName, (
            ...hookArgs: any[]
        ) => {
            for(const param of params){
                let hookArg = hookArgs[param.paramExpectedIndex];
                if(!hookArg){
                    return;
                }
                for(const property of param.properties){
                    if(!foundry.utils.hasProperty(hookArg, property.key)){
                        return;
                    }
                    if(property.value && (property.value !== foundry.utils.getProperty(hookArg, property.key))){
                        return;
                    }
                }
            }
            console.log("Hook resolved with args:");
            console.log(hookArgs);
            resolve(true);
            Hooks.off(hookName, hookId);
        });
        setTimeout(function() {
            Hooks.off(hookName, hookId);
            resolve(false);
        }, 10);
    });
}
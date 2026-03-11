import { Quench } from "@ethaks/fvtt-quench";
import { registerInternalTestBatch } from "./internal";


export function initializeTestHooks(){
    Hooks.on('quenchReady', (
        quench: Quench
    ) => {
        registerAllTestBatches(quench);
    });
}

function registerAllTestBatches(quench: Quench){
    registerInternalTestBatch(quench);
}

declare module "@league-of-foundry-developers/foundry-vtt-types/configuration" {
	namespace Hooks {
        interface HookConfig {
            /**
             * A hook event that fires when Quench is ready to register batches.
             *
             * @group Initialization
             * @see {@link quench!Quench#registerBatch quench.registerBatch}
             * @remarks This is called by {@link Hooks.callAll}
             * @param quench - The global {@link Quench} instance
             */
            quenchReady: (quench: Quench) => void;
        }
	}
}
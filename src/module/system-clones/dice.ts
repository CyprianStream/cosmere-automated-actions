import { HOOKS } from "@src/declarations/cosmere-rpg/constants/hooks";
import { DamageRollConfiguration } from "@src/declarations/cosmere-rpg/dice";
import type { DamageRoll } from "@src/declarations/cosmere-rpg/dice";
import { log } from "../utils/helpers";
export async function damageRoll(
    config: DamageRollConfiguration,
): Promise<DamageRoll> {
    // Construct roll
    let dmgRollCls = CONFIG.Dice.rolls.find((rollCls, i, obj) => {
        return rollCls.name == "DamageRoll";
    })!;
    const roll = new (dmgRollCls as any)(config.formula, config.data, {
        //@ts-ignore
        damageType: config.damageType,
        mod: config.mod,
        advantageMode: config.advantageMode,
        allowStrings: config.allowStrings,
        maximize: config.maximize,
        minimize: config.minimize,
        damageSourceName: config.damageSourceName,
        critical: config.critical,
    });

    /**
     * Hook: preDamageRoll
     */
    // Note: this setup doesn't allow for early exits from hook listeners,
    // in order to not modify the function signature and not jeopardize
    // the results with additional side effects.
    Hooks.callAll(
        HOOKS.PRE_DAMAGE_ROLL,
        roll as unknown as Roll, // Roll object | TEMP: Workaround
        config.data.source, // Source
        config, // Options
    );

    // Evaluate the roll
    await roll.evaluate();

    /**
     * Hook: damageRoll
     */
    Hooks.callAll(
        HOOKS.DAMAGE_ROLL,
        roll as unknown as Roll, // Roll object | TEMP: Workaround
        config.data.source, // Source
        config, // Options
    );

    // Return result
    //@ts-ignore
    return roll;
}
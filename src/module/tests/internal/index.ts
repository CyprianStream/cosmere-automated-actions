import { Quench } from "@ethaks/fvtt-quench";
import { MODULE_ID, MODULE_NAME } from "@src/module/constants";
import { hookRan, hookRanAfterCall, hookRanWithParamWithProperty, TestCombat, TestCombatantOptions, createTestCombat, getNumMatching, teardownTestCombat} from "../helpers";
import { ActorType, AdversaryRole, TurnSpeed } from "@src/declarations/cosmere-rpg/types/cosmere";
import { AdversaryActor, CosmereCombat, CosmereCombatant } from "@src/declarations/cosmere-rpg/documents";
import { getAllModuleSettings, getModuleSetting, setAllModuleSettings, setModuleSetting, SETTINGS } from "@src/module/utils/settings";

export function registerInternalTestBatch(quench: Quench){
    quench.registerBatch(
        `${MODULE_ID}.internal.surges`,
        (context) => {
            const { describe, it, assert, before, after, beforeEach, afterEach, expect, should } = context;


            // describe("Combat tracker UI suite", function() {
            //     it("placeholder test", function() {
            //         assert.ok(true, "Internal test infrastructure is working");
            //     });
            // });
            describe("On turn start effects", async function() {
                console.log("Registering turn start effects suite");
                let testCombat: TestCombat = {};
                let testCombatantOptions: TestCombatantOptions[] = [
                    {
                        actorType: ActorType.Character,
                        turnSpeed: TurnSpeed.Fast,
                        name: "Caster",
                    },
                    {
                        actorType: ActorType.Character,
                        turnSpeed: TurnSpeed.Slow,
                        name: "Target",
                    },
                    {
                        actorType: ActorType.Adversary,
                        turnSpeed: TurnSpeed.Fast,
                    },
                    {
                        actorType: ActorType.Adversary,
                        turnSpeed: TurnSpeed.Slow,
                    },
                    {
                        actorType: ActorType.Adversary,
                        adversaryRole: AdversaryRole.Boss
                    }
                ];
                beforeEach(async function() {
                    testCombat = await createTestCombat(testCombatantOptions);
                });

                describe("Self-infusion", async function() {

                });

                describe("Other-infusion", async function() {

                });

                afterEach(async function() {
                    await teardownTestCombat(testCombat);
                })
            });

            describe("On turn end effects", async function() {
                console.log("Registering turn end effects suite");
                let testCombat: TestCombat = {};
                let testCombatantOptions: TestCombatantOptions[] = [
                    {
                        actorType: ActorType.Character,
                        turnSpeed: TurnSpeed.Fast,
                        name: "Caster",
                    },
                    {
                        actorType: ActorType.Character,
                        turnSpeed: TurnSpeed.Slow,
                    },
                    {
                        actorType: ActorType.Adversary,
                        turnSpeed: TurnSpeed.Fast,
                    },
                    {
                        actorType: ActorType.Adversary,
                        turnSpeed: TurnSpeed.Slow,
                    },
                    {
                        actorType: ActorType.Adversary,
                        adversaryRole: AdversaryRole.Boss
                    }
                ];

                beforeEach(async function() {
                    testCombat = await createTestCombat(testCombatantOptions);
                });

                afterEach(async function() {
                    await teardownTestCombat(testCombat as TestCombat);
                });
            });

            describe("Settings suite", async function() {
                console.log("Registering settings suite");
                let testCombat: TestCombat = {};
                let testCombatantOptions: TestCombatantOptions[] = [
                    {
                        actorType: ActorType.Character,
                        turnSpeed: TurnSpeed.Fast,
                    },
                    {
                        actorType: ActorType.Character,
                        turnSpeed: TurnSpeed.Slow,
                    },
                    {
                        actorType: ActorType.Adversary,
                        turnSpeed: TurnSpeed.Fast,
                    },
                    {
                        actorType: ActorType.Adversary,
                        turnSpeed: TurnSpeed.Slow,
                    },
                    {
                        actorType: ActorType.Adversary,
                        adversaryRole: AdversaryRole.Boss
                    }
                ];
                let currentSettings = getAllModuleSettings();

                beforeEach(async function() {
                    testCombat = await createTestCombat(testCombatantOptions);
                });

                afterEach(async function() {
                    helperCombatant = undefined as any;
                    await teardownTestCombat(testCombat as TestCombat);
                    await setAllModuleSettings(currentSettings);
                });
            });
        },
        { displayName: `${MODULE_NAME}: Internal Tests` }
    );
}

var helperCombatant: CosmereCombatant;
var helperCombat: CosmereCombat;

async function startTurn(){
    //@ts-ignore: This will fail because the declaration says it doesn't exist, but as long as CAE exists, it will succeed
    await helperCombat.setCurrentTurnFromCombatant(helperCombatant);
}

async function endTurn(){
    await helperCombat.nextTurn();
}

async function nextRound(){
    await helperCombat.nextRound();
}
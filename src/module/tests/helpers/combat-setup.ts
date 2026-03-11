import { ActorType, AdversaryRole, TurnSpeed } from '@system/types/cosmere';
import { MODULE_ID, SYSTEM_ID } from '@module/constants';
import { CosmereCombat, CosmereCombatant } from '@system/documents';
import { AdversaryActor, CosmereActor } from '@src/declarations/cosmere-rpg/documents';

export interface TestCombatantOptions {
    name?: string;
    actorType?: ActorType;
    adversaryRole?: AdversaryRole;
    turnSpeed?: TurnSpeed;
}

export interface TestCombat {
    combat?: CosmereCombat;
    actors?: Actor.Implementation[];
    tokenDocuments?: TokenDocument.Implementation[];
    combatants?: CosmereCombatant[];
}

export async function createTestCombat(
    combatantOptions?: TestCombatantOptions[],
): Promise<TestCombat> {
    // console.log("Setting up test combat");
    const options = combatantOptions ?? [
        { },
        { },
    ];

    // Create actors and tokens
    const actors: Actor.Implementation[] = [];
    const tokenDocuments: TokenDocument.Implementation[] = [];
    const tokens: foundry.canvas.placeables.Token.Implementation[] = [];
    for (let i = 0; i < options.length; i++) {
        var actorOptions = options[i];
        actorOptions.actorType ??= ActorType.Character;
        actorOptions.name ??= `Automated Test ${actorOptions.actorType} ${i}`;

        const actorData = {
            name: actorOptions.name,
            type: actorOptions.actorType,
        };

        const actor = (await Actor.create(actorData as any) as CosmereActor)!;

        if (actorOptions.actorType === ActorType.Adversary) {
            //@ts-ignore
            await (actor as AdversaryActor).update({["system.role"]: actorOptions.adversaryRole ?? AdversaryRole.Rival});
        }

        actors.push(actor);
        // console.log("Created actor:");
        // console.log(actor);
        const tokenDoc = await TokenDocument.create(await actor.getTokenDocument({}, {parent: canvas?.scene}) as any, {parent: canvas?.scene});
        tokenDocuments.push(tokenDoc!);
        // console.log("Created tokenDoc:");
        // console.log(tokenDoc);
    }


    const combat = (await CosmereCombat.create({}))!;

    combat.activate();

    // console.log("Waiting for combatant creation to complete");

    let combatantsPromise = new Promise<CosmereCombatant[]>((resolve, reject) => {
        let combatantDoneHook = Hooks.on("createCombatant", (
            newCombatant: CosmereCombatant,
        ) => {
            // console.log("Creating combatant");
            // console.log("Combat:");
            // console.log(combat)
            for(const actor of actors){
                // console.log("Checking actor for combatants existence:");
                // console.log(actor);
                let expectedNumCombatants = 0;
                if(actor.isAdversary() && (actor as AdversaryActor).system.role == AdversaryRole.Boss){
                    expectedNumCombatants = 2;
                }
                else{
                    expectedNumCombatants = 1;
                }
                let numActorCombatants = combat.getCombatantsByActor(actor).length;
                if(numActorCombatants !== expectedNumCombatants){
                    return;
                }
            }
            let createdCombatants: CosmereCombatant[] = [];
            for(const combatant of combat.combatants){
                createdCombatants.push(combatant);
            }
            resolve(createdCombatants);
            Hooks.off("createCombatant", combatantDoneHook);
        })
    })

    TokenDocument.implementation.createCombatants(tokenDocuments);

    const combatants = await combatantsPromise;

    // console.log("Created combatants:");
    // console.log(combatants);

    for(const combatant of combat.combatants){
        if(!combatant.isBoss){
            const testOptions = options.find((opt) => {return opt.name === combatant.actor.name})!;
            if(testOptions.turnSpeed === TurnSpeed.Fast){
                await combatant.toggleTurnSpeed();
            }
        }
    }

    await combat.startCombat();

    console.log("Test combat setup complete");
    console.log({combat, actors, tokenDocuments, combatants});

    return { combat, actors, tokenDocuments, combatants };
}

export async function teardownTestCombat(
    testCombat: TestCombat,
): Promise<void> {
    // console.log("Tearing down test combat");
    // console.log(testCombat);

    if(testCombat.tokenDocuments){
        // console.log("Deleting token documents");
        for (const tokenDoc of testCombat.tokenDocuments){
            // console.log(tokenDoc);
            await tokenDoc.delete();
        }
    }

    if (testCombat.combat?.id) {
        // console.log("Deleting combat");
        await testCombat.combat.delete();
    }

    if(testCombat.actors){
        // console.log("Deleting actors");
        for (const actor of testCombat.actors) {
            if (actor?.id) {
                await actor.delete();
            }
        }
    }
    console.log("Test combat teardown complete");
}

export function getNumMatching(matchingType: "actor" | "token" | "combatant", testCombat: TestCombat, option: TestCombatantOptions) {
    if(matchingType == "actor"){
        return testCombat.actors?.filter((actor) => {
            let isMatching = true;
            if(option.name){
                isMatching &&= actor.name == option.name;
            }
            isMatching &&= actor.type == (option.actorType ?? ActorType.Character);
            if(actor.type == ActorType.Adversary){
                isMatching &&= (actor as AdversaryActor).system.role == (option.adversaryRole ?? AdversaryRole.Rival);
            }
            return isMatching;
        }).length;
    }

    if(matchingType == "token"){
        return testCombat.tokenDocuments?.filter((token) => {
            let isMatching = true;
            if(option.name){
                isMatching &&= token.actor?.name == option.name;
            }
            isMatching &&= token.actor?.type == (option.actorType ?? ActorType.Character);
            if(token.actor?.type == ActorType.Adversary){
                isMatching &&= (token.actor! as AdversaryActor).system.role == (option.adversaryRole ?? AdversaryRole.Rival);
            }
            return isMatching;
        }).length;
    }

    if(matchingType == "combatant"){
        return testCombat.combat?.combatants?.filter((combatant) => {
            let isMatching = true;
            if(option.name){
                isMatching &&= combatant.actor.name == option.name;
            }
            isMatching &&= combatant.actor.type == (option.actorType ?? ActorType.Character);
            if(combatant.actor.type == ActorType.Adversary){
                isMatching &&= (combatant.actor as AdversaryActor).system.role == (option.adversaryRole ?? AdversaryRole.Rival);
            }
            if(option.turnSpeed){
                isMatching &&= combatant.turnSpeed == option.turnSpeed;
            }
            return isMatching;
        }).length;
    }
    return 0;
}
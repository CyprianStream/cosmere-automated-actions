import { AnyObject } from "@league-of-foundry-developers/foundry-vtt-types/utils";
import { CosmereActor } from "@src/declarations/cosmere-rpg/documents";
import { Resource } from "@src/declarations/cosmere-rpg/types/cosmere";
import { TEMPLATES } from "@src/module/utils/templates";

export class RecoverPrompt extends foundry.applications.api.HandlebarsApplicationMixin(
    foundry.applications.api.ApplicationV2<AnyObject>
) {

    static DEFAULT_OPTIONS = {
        actions: {
            increaseGain: this._onIncreaseGain,
            decreaseGain: this._onDecreaseGain,
            submit: this._onSubmit,
        },
        window: {
            title: "How do you want to split up your recovery?",
            minimizable: false,
            resizable: false,
            positioned: true,
            position: { width: 400 }
        },
        form: {
            closeOnSubmit: true,
        },
        classes: ['dialog', 'recover', 'CAA'],
        tag: 'dialog',
    };
    static PARTS = foundry.utils.mergeObject(
        foundry.utils.deepClone(super.PARTS),
        {
            form: {
                template: TEMPLATES.RECOVER_PROMPT,
                templates:[
                    TEMPLATES.RECOVER_RESOURCE,
                ]
            }
        }
    )
    readonly pointsGained: number;
    readonly actor: CosmereActor;
    pointsRemaining: number;
    resourcesToChooseFrom: Resource[];
    gained: Record<Resource, number>;
    submitResolver?: Function;

    constructor(actor: CosmereActor, pointsGained: number, resourcesToChooseFrom: Resource[] = [Resource.Health, Resource.Focus]){
        super({
            id: "recover-prompt-{id}",

        });
        this.pointsGained = pointsGained;
        this.actor = actor;
        this.pointsRemaining = pointsGained;
        this.resourcesToChooseFrom = resourcesToChooseFrom;
        this.gained = {
            [Resource.Health]: 0,
            [Resource.Focus]: 0,
            [Resource.Investiture]: 0,
        };
    }

    async _prepareContext(){
        return {
            resourcesToChooseFrom: this.resourcesToChooseFrom,
            pointsRemaining: this.pointsRemaining,
            pointsGained: this.pointsGained,
            gained: this.gained,
            actor: this.actor
        }
    }

    public static async prompt(actor: CosmereActor, pointsGained: number, resourcesToChooseFrom?: Resource[]): Promise<Record<Resource, number>>{
        return (await RecoverPrompt.wait(actor, pointsGained, resourcesToChooseFrom)) as Record<Resource,number>;
    }

    /**
    * Spawn a dialog and wait for it to be dismissed or submitted.
    * @param {Partial<ApplicationConfiguration & DialogV2Configuration & DialogV2WaitOptions>} [config]
    * @returns {Promise<any>}                          Resolves to the identifier of the button used to submit the
    *                                                  dialog, or the value returned by that button's callback. If the
    *                                                  dialog was dismissed, and rejectClose is false, the Promise
    *                                                  resolves to null.
    */
    static async wait(actor: CosmereActor, pointsGained: number, resourcesToChooseFrom?: Resource[]) {
        return new Promise((resolve, reject) => {
        // Wrap submission handler with Promise resolution.
        const dialog = new this(actor, pointsGained, resourcesToChooseFrom)
        dialog.submitResolver = async (result: Record<Resource, number>, dialog: RecoverPrompt) => {
            resolve(result);
        };
        dialog.addEventListener("close", event => {
            reject(new Error("Dialog was dismissed without submitting."));
        }, {once: true});
        dialog.render({force: true});
        });
    }

    protected static _onIncreaseGain(
        this: RecoverPrompt,
        event: Event
    ){


    }

    protected static _onDecreaseGain(
        this: RecoverPrompt,
        event: Event
    ){


    }

    protected static async _onSubmit(
        this: RecoverPrompt,
        event: Event
    ){
        event.preventDefault();
        const result = this.gained;
        await this.submitResolver?.(result, this);
        this.close({ submitted: true });
        return;
    }
}
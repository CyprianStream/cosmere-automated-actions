import { AnyObject } from "@league-of-foundry-developers/foundry-vtt-types/utils";
import { MODULE_ID, MODULE_NAME } from "@src/module/constants";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

interface ReleaseNotesDialogOptions {
    /**
     * Whether to show the patch notes.
     */
    patch?: boolean;
}

export class ReleaseNotesDialog extends HandlebarsApplicationMixin(
    ApplicationV2<AnyObject>,
) {
    static DEFAULT_OPTIONS = {
        window: {
            resizable: true,
        },
        position: {
            width: 800,
        },
        classes: ['cosmere', 'dialog', 'release-notes'],
    };

    static PARTS = foundry.utils.mergeObject(
        foundry.utils.deepClone(super.PARTS),
        {
            release: {
                template: `modules/${MODULE_ID}/release-notes.html`,
            },
            patch: {
                template: `modules/${MODULE_ID}/patch-notes.html`,
            },
        },
    );

    private patch: boolean;

    private constructor(options: ReleaseNotesDialogOptions = {}) {
        super({
            window: {
                title: `${MODULE_NAME}: Release Notes`,
            },
        });

        this.patch = options.patch ?? false;
    }

    /* --- Statics --- */

    static async show(options: ReleaseNotesDialogOptions = {}) {
        await new this(options).render(true);
    }

    /* --- Lifecycle --- */

    protected async _onRender(context: AnyObject, options: AnyObject) {
        await super._onRender(context, options);

        $(this.element).attr('open', 'true');

        if (this.patch) {
            $(this.element).find('[data-application-part="release"]').hide();
            $(this.element).find('[data-application-part="patch"]').show();
        } else {
            $(this.element).find('[data-application-part="release"]').show();
            $(this.element).find('[data-application-part="patch"]').hide();
        }
    }

    /* --- Context --- */

    public _prepareContext() {
        return Promise.resolve({
            version: game.modules?.get(MODULE_ID)?.version,
        });
    }
}

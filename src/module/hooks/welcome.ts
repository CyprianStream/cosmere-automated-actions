// Dialogs
import { ReleaseNotesDialog } from '@module/applications/dialogs/release-notes';

// Constants
import {
    MODULE_ID,
    METALWORKS_DISCORD_INVITE,
    GITHUB_ISSUES_URL,
    AUTHOR_NAME,
} from '@module/constants';

// Settings
import { getModuleSetting, setModuleSetting, SETTINGS } from '@module/utils/settings';

// Migration (Keeping for the future)
// import { migrate, requiresMigration } from '../utils/migration';
export function registerWelcomeMessage(){
    Hooks.on('ready', async () => {
        // Ensure user is a GM
        if (!game.user?.isGM) return;

        // The current installed version of the system
        const currentVersion = game.modules?.get(MODULE_ID)?.version!;

        // The last used version of the system
        const latestVersion = getModuleSetting<string>(
            SETTINGS.INTERNAL_LATEST_VERSION,
        );

        const [currentMajor, currentMinor, currentPatch] = currentVersion
            .split('.')
            .map(Number);
        const [latestMajor, latestMinor, latestPatch] = latestVersion
            .split('.')
            .map(Number);

        // Convert the version strings to numbers
        const currentVersionNum =
            currentMajor * 1000000 + currentMinor * 1000 + currentPatch;
        const latestVersionNum =
            latestMajor * 1000000 + latestMinor * 1000 + latestPatch;

        if (currentVersionNum > latestVersionNum) {
            // Show the release notes
            void ReleaseNotesDialog.show({
                patch: !(currentMajor > latestMajor || currentMinor > latestMinor),
            });

            // Migrate data from the previous version of the system
            // if (requiresMigration(latestVersion, currentVersion)) {
            //     await migrate(latestVersion, currentVersion);
            // }

            // Record the latest version of the system
            await setModuleSetting(
                SETTINGS.INTERNAL_LATEST_VERSION,
                currentVersion,
            );
        }
    });
}

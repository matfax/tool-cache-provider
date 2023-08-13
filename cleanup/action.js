const core = require('@actions/core')
const io = require('@actions/io')
const fs = require('fs').promises

async function main() {

    // Get the prefix from the workflow inputs
    const prefix = core.getInput('prefix')

    // Find all versioned runner directories with the specified prefix and sort them
    try {
        const dirs = await fs.readdir('/actions-runner')
        const versionedFolders = dirs
            .filter(dir => dir.startsWith(prefix + '.'))
            .sort()

        // Only proceed if there are more than 1 versioned folders
        if (versionedFolders.length > 1) {

            const oldestVersion = versionedFolders[0]

            core.info(`deleting old runner tools version: ${oldestVersion}`)
            await io.rmRF(`/actions-runner/${oldestVersion}`)
            core.info('deletion completed')
        } else {
            core.info('there is only one versioned folder: SKIPPING')
        }
    } catch (error) {
        core.error('failed to read the directory or delete the folder')
        core.setFailed(error.message)
    }
}

main().then(() => {
    core.info('cleanup action completed')
})

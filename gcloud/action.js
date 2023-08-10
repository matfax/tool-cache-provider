const core = require("@actions/core");
const { exec } = require("@actions/exec");
const { parseArgsStringToArgv } = require('string-argv')

const commandArgs = parseArgsStringToArgv(core.getInput('command'))
const subCommandArgs = parseArgsStringToArgv(core.getInput('subcommand'))
const options = {
    ignoreReturnCode: true
}
const args = [...commandArgs, ...subCommandArgs, '--quiet', '--format="json"']

exec.run('gcloud', args, options, (error, stdout) => {
    if (error) {
        if (!core.getBooleanInput('expect_failure')) {
            core.setFailed(error);
        }
    } else {
        if (core.getBooleanInput('expect_failure') && result.exitCode === 0) {
            core.setFailed('expected failure but got success');
        }

        if (core.getBooleanInput('expect_output')) {
            const result = JSON.parse(stdout);
            if (!result.output) {
                core.setFailed('expected output but got nothing');
            }
            core.setOutput('result', result.output);
        }
    }
})

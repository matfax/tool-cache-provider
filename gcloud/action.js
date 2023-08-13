const core = require("@actions/core");
const { getExecOutput } = require("@actions/exec");
const { parseArgsStringToArgv } = require('string-argv')

const main = async () => {
    const commandArgs = parseArgsStringToArgv(core.getInput('command'))
    const subCommandArgs = parseArgsStringToArgv(core.getInput('subcommand'))
    const options = {
        ignoreReturnCode: true,
        silent: true,
    }
    const args = [
        ...commandArgs,
        ...subCommandArgs,
        '--quiet',
        '--format="json"',
        '--verbosity=info'
    ]

    const output = await getExecOutput('gcloud', args, options)

    const expectFailure = core.getBooleanInput('expect_failure');
    const expectOutput = core.getBooleanInput('expect_output');

    if (output.exitCode !== 0) {
        if (!expectFailure) {
            core.setFailed(output.stderr.split('\n').pop());
        }
    } else if (expectFailure) {
        core.setFailed('expected failure but got success');
    } else if (expectOutput && output.stdout === '') {
        core.setFailed('expected output but got nothing');
    }

    core.setOutput('exitCode', output.exitCode);
    core.setOutput('result', output.stdout);

    return output
}

main().then(value => {
    core.info(value.stderr)
    core.info(`gcloud command action completed with status code ${value.exitCode}`)
})

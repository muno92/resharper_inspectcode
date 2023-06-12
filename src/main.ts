import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {Installer} from './installer'
import {Report} from './report'
import {ReSharperSeverity} from './issue'

async function run(): Promise<void> {
  try {
    core.info('test1')
    const installer = new Installer()
    const version: string = core.getInput('version') ?? ''
    await installer.install(version)

    const solutionPath: string = core.getInput('solutionPath')
    const outputPath = 'result.xml'

    let command = `jb inspectcode --build --output=${outputPath} --absolute-paths ${solutionPath}`

    const include: string = core.getInput('include')
    if (include) {
      command += ` --include=${include.trim().replace(/[\r\n]+/g, ';')}`
    }

    const exclude = core.getInput('exclude') ?? ''
    if (exclude !== '') {
      command += ` --exclude=${exclude}`
    }

    const solutionWideAnalysis: string =
      core.getInput('solutionWideAnalysis') ?? ''
    if (solutionWideAnalysis !== '') {
      command += ` --${
        solutionWideAnalysis.toLowerCase() !== 'true' ? 'no-' : ''
      }swea`
    }

    const minimumReportSeverity = getMinimumReportSeverity()

    command += ` --severity=${minimumReportSeverity}`

    const workingDir: string = core.getInput('workingDirectory')
    if (workingDir) {
      core.debug(`Changing to working directory: ${workingDir}`)
      process.chdir(workingDir)
    }

    await exec.exec(command)

    const ignoreIssueType = core.getInput('ignoreIssueType') ?? ''

    const report = new Report(outputPath, ignoreIssueType)
    report.output()

    const failOnIssue = core.getInput('failOnIssue')
    const minimumSeverity = core.getInput('minimumSeverity') ?? 'notice'

    if (failOnIssue !== '1') {
      return
    }

    if (report.issueOverThresholdIsExists(minimumSeverity)) {
      core.setFailed('Issues found.')
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

function getMinimumReportSeverity(): ReSharperSeverity {
  const minimumReportSeverity =
    core.getInput('minimumReportSeverity').toUpperCase() ?? ''

  switch (minimumReportSeverity) {
    case 'INTO':
      return 'INFO'
    case 'SUGGESTION':
      return 'SUGGESTION'
    case 'WARNING':
      return 'WARNING'
    case 'ERROR':
      return 'ERROR'
    default:
      return 'HINT'
  }
}

run()

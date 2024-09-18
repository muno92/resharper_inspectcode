import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {Installer} from './installer'
import {XmlReport} from './report/xml'
import {ReSharperSeverity} from './issue'
import {Report} from './report/report'
import {SarifReport} from './report/sarif'

async function run(): Promise<void> {
  try {
    const workingDir: string = core.getInput('workingDirectory')
    if (workingDir) {
      core.debug(`Changing to working directory: ${workingDir}`)
      process.chdir(workingDir)
    }

    const installer = new Installer()
    const version: string = core.getInput('version') ?? ''
    await installer.install(version)

    const solutionPath: string = core.getInput('solutionPath')
    const outputPath = 'result'

    let command = `jb inspectcode --output=${outputPath} --absolute-paths ${solutionPath}`

    const verbosity: string = core.getInput('verbosity') ?? ''
    if (verbosity !== '') {
      command += ` --verbosity=${verbosity}`
    }

    const include: string = core.getInput('include')
    if (include) {
      command += ` --include="${include.trim().replace(/[\r\n]+/g, ';')}"`
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

    const extensions: string = core.getInput('extensions')
    if (extensions) {
      command += ` --extensions=${extensions
        .trim()
        .replace(/(,\s?)|(;\s?)/g, ';')}`
    }

    const noBuild = core.getInput('noBuild') ?? ''
    if (noBuild.toLowerCase() === 'true') {
      command += ' --no-build'
    } else {
      command += ' --build'
    }

    const cachesHome = core.getInput('cachesHome') ?? ''
    if (cachesHome !== '') {
      command += ` --caches-home=${cachesHome}`
    }

    const properties: string = core.getInput('properties') ?? ''
    if (properties) {
      command += ` --properties:"${properties}"`
    }

    const dotnetVersion: string = core.getInput('dotnetVersion') ?? ''
    if (dotnetVersion) {
      command += ` --dotnetcoresdk=${dotnetVersion}`
    }

    await exec.exec(command)

    const ignoreIssueType = (core.getInput('ignoreIssueType') ?? '')
      .trim()
      .replace(/[\r\n]+/g, ',')

    const report = await parseResult(outputPath, ignoreIssueType)
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

async function parseResult(
  outputPath: string,
  ignoreIssueType: string
): Promise<Report> {
  const resharperVersion = await getResharperVersion()
  const match = resharperVersion.match(/\d{4}/)
  if (match === null) {
    throw new Error('Failed to get ReSharper release year')
  }
  const resharperReleaseYear = Number(match[0])
  if (resharperReleaseYear < 2024) {
    // Before ReSharper 2024.1, the default format is XML and SARIF format doesn't contain level.
    return new XmlReport(outputPath, ignoreIssueType)
  }
  return new SarifReport(outputPath, ignoreIssueType)
}

async function getResharperVersion(): Promise<string> {
  const output = (await exec.getExecOutput('jb inspectcode --version')).stdout
  // node-semver can't parse format like "2024.1", so use regex
  const match = output.match(/Version: (\d{4}\.\d+\.?\d*)/)

  if (match === null) {
    throw new Error('Failed to get ReSharper version')
  }

  return match[1]
}

function getMinimumReportSeverity(): ReSharperSeverity {
  const minimumReportSeverity =
    core.getInput('minimumReportSeverity').toUpperCase() ?? ''

  switch (minimumReportSeverity) {
    case 'INFO':
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

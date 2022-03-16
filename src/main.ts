import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {Installer} from './installer'
import {Report} from './report'
import path from 'path'

async function run(): Promise<void> {
  try {
    const installer = new Installer()
    const version: string = core.getInput('version')
    await installer.install(version)

    const cwd = process.cwd()

    const solutionPath: string = path.join(cwd, core.getInput('solutionPath'))
    const outputPath = path.join(cwd, 'result.xml')

    let command = `jb inspectcode -o=${outputPath} -a ${solutionPath} --build`

    const exclude = core.getInput('exclude') ?? ''
    if (exclude !== '') {
      command += ` --exclude=${exclude}`
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
      core.setFailed('Issue is exist.')
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()

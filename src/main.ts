import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {Installer} from './installer'
import {Report} from './report'
import path from 'path'


async function run(): Promise<void> {
  try {
    const installer = new Installer()
    const version: string = core.getInput('version')
    const executablePath = core.getInput('executablePath') ?? 'jb'
    const removeTests = core.getInput('shouldRemoveTests') ?? false
    await installer.install(version, executablePath)

    const cwd = process.cwd()

    const solutionPath: string = path.join(cwd, core.getInput('solutionPath'))
    
    const outputPath = path.join(cwd, 'result.xml')

    let command = `${executablePath} inspectcode -o=${outputPath} -a ${solutionPath} --build --verbosity=WARN`
    if (removeTests) {
      const tests_path = solutionPath.replace(solutionPath.split('/')[solutionPath.split('/').length - 1], "tests")
      await exec.exec(`rm -rf ${tests_path}`)
    }

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

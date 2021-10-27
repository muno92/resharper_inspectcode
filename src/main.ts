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
    await exec.exec(
      `jb inspectcode -o=${outputPath} -a ${solutionPath} --build`
    )

    const report = new Report(outputPath)
    report.output()

    const failOnIssue = core.getInput('failOnIssue')

    if (failOnIssue === '1' && report.issues.length > 0) {
      core.setFailed('Issue is exist.')
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()

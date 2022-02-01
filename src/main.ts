import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {Installer} from './installer'
import {Report} from './report'
import {Severity} from './issue'
import path from 'path'

async function run(): Promise<void> {
  try {
    const installer = new Installer()
    const version: string = core.getInput('version')
    await installer.install(version)

    const cwd = process.cwd()

    const solutionPath: string = path.join(cwd, core.getInput('solutionPath'))
    const outputPath = path.join(cwd, 'result.xml')
    await exec.exec(`jb inspectcode -o=${outputPath} -a ${solutionPath}`)

    const report = new Report(outputPath)
    report.output()

    const failOnIssue = core.getInput('failOnIssue')
    const minimumSeverity = core.getInput('minimumSeverity') ?? 'notice'

    if (failOnIssue !== '1') {
      return
    }

    const errorTarget = switchErrorTarget(minimumSeverity)

    const issues = report.issues.filter(i => errorTarget.includes(i.Severity))
    if (issues.length > 0) {
      core.setFailed('Issue is exist.')
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

function switchErrorTarget(minimumSeverity: string): Severity[] {
  if (minimumSeverity === 'error') {
    return ['error']
  }
  if (minimumSeverity === 'warning') {
    return ['warning', 'error']
  }
  return ['notice', 'warning', 'error']
}

run()

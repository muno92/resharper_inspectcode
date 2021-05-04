import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {Installer} from './installer'
import path from 'path'
import {Report} from './report'

async function run(): Promise<void> {
  try {
    const installer = new Installer()
    await installer.install()

    const cwd = process.cwd()

    const solutionPath: string = path.join(cwd, core.getInput('solutionPath'))
    const outputPath = path.join(cwd, 'result.xml')
    await exec.exec(`jb inspectcode -o=${outputPath} -a ${solutionPath}`)

    const matcherPath = path.join(__dirname, '..', '.github', 'inspection.json')
    // eslint-disable-next-line no-console
    console.log(`##[add-matcher]${matcherPath}`)

    const report = new Report(outputPath)
    report.output()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

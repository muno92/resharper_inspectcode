import * as core from '@actions/core'
import * as fs from 'fs'
import {GitHubSeverity, Issue} from '../issue'
import {issueCommand} from '@actions/core/lib/command'

// Ignore `none` severity
type SarifSeverity = 'note' | 'warning' | 'error'

type Result = {
  ruleId: string
  level: SarifSeverity
  message: {
    text: string
  }
  locations: {
    physicalLocation: {
      artifactLocation: {
        uri: string
      }
      region: {
        startLine: number
        startColumn: number
      }
    }
  }[]
}

// The minimum required type for this project
type Sarif = {
  runs: {
    results: Result[]
  }[]
}

export class SarifReport {
  issues: Issue[]

  constructor(reportPath: string, ignoreIssueType: string) {
    this.issues = []

    let file: string
    try {
      file = fs.readFileSync(reportPath, {encoding: 'utf8'})
    } catch (err) {
      if (err instanceof Error) {
        core.error(err.message)
      }
      return
    }

    const ignoreIssueTypes = ignoreIssueType.split(',').map(s => s.trim())

    const sarif = JSON.parse(file) as Sarif
    this.issues = this.extractIssues(sarif, ignoreIssueTypes)
  }

  private extractIssues(sarif: Sarif, ignoreIssueTypes: string[]): Issue[] {
    return sarif.runs
      .flatMap(run => {
        return run.results.flatMap(result => this.parseIssue(result))
      })
      .filter(
        (issue): issue is NonNullable<Issue> =>
          issue != null && !ignoreIssueTypes.includes(issue.TypeId)
      )
  }

  private parseIssue(result: Result): Issue | null {
    if (result.locations.length === 0) {
      return null
    }
    const location = result.locations[0]

    const convertSeverity = (severity: SarifSeverity): GitHubSeverity => {
      switch (severity) {
        case 'note':
          return 'notice'
        case 'warning':
          return 'warning'
        default:
          return 'error' //In Problem Matchers, default severity is error
      }
    }

    return new Issue(
      result.ruleId,
      location.physicalLocation.artifactLocation.uri.replace('file://', ''),
      location.physicalLocation.region.startColumn,
      result.message.text,
      convertSeverity(result.level),
      location.physicalLocation.region.startLine
    )
  }

  output(): void {
    for (const issue of this.issues) {
      const properties: {[key: string]: string | number} = {}

      properties['file'] = issue.FilePath
      if (issue.Line) {
        properties['line'] = issue.Line
        properties['col'] = issue.Column
      }

      issueCommand(issue.Severity, properties, issue.output())
    }
  }

  issueOverThresholdIsExists(minimumSeverity: string): boolean {
    const errorTarget = this.switchErrorTarget(minimumSeverity)

    return this.issues.filter(i => errorTarget.includes(i.Severity)).length > 0
  }

  private switchErrorTarget(minimumSeverity: string): GitHubSeverity[] {
    if (minimumSeverity === 'error') {
      return ['error']
    }
    if (minimumSeverity === 'warning') {
      return ['warning', 'error']
    }
    return ['notice', 'warning', 'error']
  }
}

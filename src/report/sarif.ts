import {error} from '@actions/core'
import {readFileSync} from 'fs'
import {GitHubSeverity, Issue} from '../issue'
import {Report} from './report'

// Ignore `none` severity
type SarifSeverity = 'note' | 'warning' | 'error'

type Result = {
  ruleId: string
  level: SarifSeverity
  message: {
    text: string
  }
  locations: Array<{
    physicalLocation: {
      artifactLocation: {
        uri: string
      }
      region: {
        startLine: number
        startColumn: number
      }
    }
  }>
}

// The minimum required type for this project
type Sarif = {
  runs: Array<{
    results: Result[]
  }>
}

export class SarifReport extends Report {
  constructor(reportPath: string, ignoreIssueType: string) {
    super()

    let file: string
    try {
      file = readFileSync(reportPath, {encoding: 'utf8'})
    } catch (err) {
      if (err instanceof Error) {
        error(err.message)
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
}

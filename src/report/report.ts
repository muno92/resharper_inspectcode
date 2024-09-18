import {GitHubSeverity, Issue} from '../issue'
import {issueCommand} from '@actions/core/lib/command'

export abstract class Report {
  issues: Issue[]

  constructor() {
    this.issues = []
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

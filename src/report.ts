import * as core from '@actions/core'
import * as fs from 'fs'
import {GitHubSeverity, Issue, IssueTypes} from './issue'
import {issueCommand} from '@actions/core/lib/command'

export class Report {
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

    const sarifReport = JSON.parse(file)
    const ignoreIssueTypes = ignoreIssueType.split(',').map(s => s.trim())

    const issueTypes = this.extractIssueTypes(sarifReport)
    this.issues = this.extractIssues(sarifReport, issueTypes, ignoreIssueTypes)
  }

  private extractIssues(
    sarifReport: any,
    issueTypes: IssueTypes,
    ignoreIssueTypes: string[]
  ): Issue[] {
    const issues: Issue[] = []

    for (const run of sarifReport.runs) {
      for (const result of run.results) {
        const issue = this.parseIssue(result, issueTypes)
        if (issue && !ignoreIssueTypes.includes(issue.TypeId)) {
          issues.push(issue)
        }
      }
    }

    return issues
  }

  private parseIssue(result: any, issueTypes: IssueTypes): Issue | null {
    const ruleId = result.ruleId
    const message = result.message?.text
    const location = result.locations?.[0]?.physicalLocation
    const filePath = location?.artifactLocation?.uri
    const region = location?.region

    if (!ruleId || !filePath || !message || !region) {
      return null
    }

    const column = region.startColumn || 0
    const issue = new Issue(
      ruleId,
      filePath,
      column,
      message,
      issueTypes[ruleId]
    )

    if (region.startLine) {
      issue.Line = region.startLine
    }

    return issue
  }

  private extractIssueTypes(sarifReport: any): IssueTypes {
    const issueTypes: IssueTypes = {}

    const convertSeverity = (severity: string): GitHubSeverity => {
      switch (severity) {
        case 'note':
          return 'notice'
        case 'warning':
          return 'warning'
        default:
          return 'error'
      }
    }

    for (const run of sarifReport.runs) {
      for (const rule of run.tool.driver.rules) {
        const id = rule.id
        const severity = rule.properties?.['defaultSeverity'] || 'error'
        issueTypes[id] = convertSeverity(severity)
      }
    }

    return issueTypes
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

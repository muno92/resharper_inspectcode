import * as core from '@actions/core'
import * as fs from 'fs'
import * as htmlparser2 from 'htmlparser2'
import {Document, Element} from 'domhandler'
import {GitHubSeverity, Issue} from './issue'
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

    const ignoreIssueTypes = ignoreIssueType.split(',').map(s => s.trim())

    const xml = htmlparser2.parseDocument(file)
    this.issues = this.extractIssues(xml, ignoreIssueTypes)
  }

  private extractIssues(
    xml: Document,
    ignoreIssueTypes: string[]
  ): Issue[] {
    return htmlparser2.DomUtils.getElementsByTagName('issue', xml)
      .map(i => this.parseIssue(i))
      .filter(
        (issue): issue is NonNullable<Issue> =>
          issue != null && !ignoreIssueTypes.includes(issue.TypeId)
      )
  }

  private parseIssue(issueTag: Element): Issue | null {
    const typeId = issueTag.attributes.find(
      a => a.name.toLowerCase() === 'typeid'
    )
    const filePath = issueTag.attributes.find(
      a => a.name.toLowerCase() === 'file'
    )
    const message = issueTag.attributes.find(
      a => a.name.toLowerCase() === 'message'
    )
    const severity = issueTag.attributes.find(
      a => a.name.toLowerCase() === 'severity'
    ) 

    const gitHubSeverity = this.convertSeverity(severity?.value.toLowerCase() ?? 'error')

    if (!typeId || !filePath || !message) {
      return null
    }

    const offset =
      issueTag.attributes.find(a => a.name.toLowerCase() === 'offset')?.value ??
      '0-0'
    const column = parseInt(offset.substring(0, offset.indexOf('-')))

    const issue = new Issue(
      typeId.value,
      filePath.value,
      column,
      message.value,
      gitHubSeverity
    )

    const line = issueTag.attributes.find(a => a.name.toLowerCase() === 'line')
    if (line) {
      issue.Line = parseInt(line.value)
    }

    return issue
  }


    convertSeverity = (severity: string): GitHubSeverity => {
      switch (severity) {
        case 'hint':
        case 'suggestion':
          return 'notice'
        case 'warning':
          return 'warning' //Severity info is not supported
        default:
          return 'error' //In Problem Matchers, default severity is error
      }
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

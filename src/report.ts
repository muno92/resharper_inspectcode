import {Issue, IssueTypes, Severity} from './issue'
import * as fs from 'fs'
import * as core from '@actions/core'
import * as htmlparser2 from 'htmlparser2'
import {Element, Node} from 'domhandler'
import {issueCommand} from '@actions/core/lib/command'

export class Report {
  issues: Issue[]

  constructor(reportPath: string) {
    this.issues = []

    let file: string
    try {
      file = fs.readFileSync(reportPath, {encoding: 'utf8'})
    } catch (err) {
      core.error(err.message)
      return
    }

    const xml = htmlparser2.parseDocument(file)
    const issueTypes = this.extractIssueTypes(xml)
    console.log(issueTypes);
    this.issues = this.extractIssues(xml, issueTypes)
  }

  private extractIssues(xml: Node, issueTypes: IssueTypes): Issue[] {
    return htmlparser2.DomUtils.getElementsByTagName('issue', xml)
      .map(i => this.parseIssue(i, issueTypes))
      .filter((issue): issue is NonNullable<Issue> => issue != null)
      .filter((issue): issue is NotIgnored<Issue> => issue.Severity !== 'ignored')
  }

  private parseIssue(issueTag: Element, issueTypes: IssueTypes): Issue | null {
    const typeId = issueTag.attributes.find(
      a => a.name.toLowerCase() === 'typeid'
    )
    const filePath = issueTag.attributes.find(
      a => a.name.toLowerCase() === 'file'
    )
    const message = issueTag.attributes.find(
      a => a.name.toLowerCase() === 'message'
    )

    if (!typeId || !filePath || !message) {
      return null
    }

    const offset =
      issueTag.attributes.find(a => a.name.toLowerCase() === 'offset')?.value ??
      '0-0'
    const column = parseInt(offset.substring(0, offset.indexOf('-')))
    console.log(typeId.value);
    const issue = new Issue(
      typeId.value,
      filePath.value,
      column,
      message.value,
      issueTypes[typeId.value]
    )

    const line = issueTag.attributes.find(a => a.name.toLowerCase() === 'line')
    if (line) {
      issue.Line = parseInt(line.value)
    }

    return issue
  }

  private extractIssueTypes(xml: Node): IssueTypes {
    const issueTypes: IssueTypes = {}

    const convertSeverity = (severity: string): Severity => {
      switch (severity) {
        case 'hint':
        case 'suggestion':
          return 'ignored';
          break;
        case 'warning':
          return 'warning';
          break;
        default:
          return 'error'; //In Problem Matchers, default severity is error
      }
    }

    const issueTypeTags = htmlparser2.DomUtils.getElementsByTagName(
      'issuetype',
      xml
    )
    for (const issueType of issueTypeTags) {
      const id = issueType.attributes.find(a => a.name.toLowerCase() === 'id')
      if (!id) {
        continue
      }
      if (issueTypes[id.value]) {
        continue
      }
      issueTypes[id.value] = convertSeverity(
        issueType.attributes
          .find(a => a.name.toLowerCase() === 'severity')
          ?.value.toLowerCase() ?? 'error'
      )
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
}

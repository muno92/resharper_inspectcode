import * as core from '@actions/core'
import * as fs from 'fs'
import * as htmlparser2 from 'htmlparser2'
import {Document, Element} from 'domhandler'
import {GitHubSeverity, Issue} from '../issue'
import {Report} from './report'

type IssueTypes = {
  [Id: string]: GitHubSeverity
}

export class XmlReport extends Report {
  constructor(reportPath: string, ignoreIssueType: string) {
    super()

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
    const issueTypes = this.extractIssueTypes(xml)
    this.issues = this.extractIssues(xml, issueTypes, ignoreIssueTypes)
  }

  private extractIssues(
    xml: Document,
    issueTypes: IssueTypes,
    ignoreIssueTypes: string[]
  ): Issue[] {
    return htmlparser2.DomUtils.getElementsByTagName('issue', xml)
      .map(i => this.parseIssue(i, issueTypes))
      .filter(
        (issue): issue is NonNullable<Issue> =>
          issue != null && !ignoreIssueTypes.includes(issue.TypeId)
      )
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

  private extractIssueTypes(xml: Document): IssueTypes {
    const issueTypes: IssueTypes = {}

    const convertSeverity = (severity: string): GitHubSeverity => {
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
}

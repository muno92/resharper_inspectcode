import {Issue} from './type'
import * as fs from 'fs'
import * as core from '@actions/core'
import * as htmlparser2 from 'htmlparser2'

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
    const issueTags = htmlparser2.DomUtils.getElementsByTagName('issue', xml)
    for (const issueTag of issueTags) {
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
        continue
      }

      const offset =
        issueTag.attributes.find(a => a.name.toLowerCase() === 'offset')
          ?.value ?? '0-0'
      const column = parseInt(offset.substring(0, offset.indexOf('-')))

      const issue: Issue = {
        TypeId: typeId.value,
        FilePath: filePath.value,
        Column: column,
        Message: message.value
      }

      const line = issueTag.attributes.find(
        a => a.name.toLowerCase() === 'line'
      )
      if (line) {
        issue.Line = parseInt(line.value)
      }

      this.issues.push(issue)
    }
  }
}

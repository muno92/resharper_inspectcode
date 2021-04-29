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
    for (const issue of issueTags) {
      const typeId = issue.attributes.find(
        a => a.name.toLowerCase() === 'typeid'
      )
      const filePath = issue.attributes.find(
        a => a.name.toLowerCase() === 'file'
      )
      if (!typeId || !filePath) {
        continue
      }
      this.issues.push({
        TypeId: typeId.value,
        FilePath: filePath.value
      })
    }
  }
}

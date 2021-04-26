import {Issue} from './type'

export class Report {
  issues: Issue[]
  constructor(private reportPath: string) {
    this.issues = []
  }
}

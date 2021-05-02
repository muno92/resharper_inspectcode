export type Issue = {
  TypeId: string
  FilePath: string
  Column: number
  Line?: number
  Message: string
  Severity: Severity
}

export type Severity = 'info' | 'warning' | 'error'

export type IssueTypes = {
  [Id: string]: Severity
}

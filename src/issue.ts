export class Issue {
  constructor(
    public TypeId: string,
    public FilePath: string,
    public Column: number,
    public Message: string,
    public Severity: Severity,
    public Line?: number
  ) {}

  output(): string {
    return `"${this.Message}" on ${this.FilePath}${
      this.Line ? `(${this.Line},${this.Column})` : ''
    }`
  }
}

export type Severity = 'warning' | 'error'

export type IssueTypes = {
  [Id: string]: Severity
}

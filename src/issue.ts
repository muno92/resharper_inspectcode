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
    return `"[${this.TypeId}] ${this.Message}" on ${this.FilePath}${
      this.Line ? `(${this.Line},${this.Column})` : ''
    }`
  }
}

<<<<<<< HEAD
export type Severity = 'ignored' | 'warning' | 'error'
=======
export type Severity = 'notice' | 'warning' | 'error'
>>>>>>> 537ae9d37a0dc8943e57058308b5a75bbb873101

export type IssueTypes = {
  [Id: string]: Severity
}

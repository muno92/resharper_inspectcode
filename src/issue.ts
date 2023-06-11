export class Issue {
  constructor(
    public TypeId: string,
    public FilePath: string,
    public Column: number,
    public Message: string,
    public Severity: GitHubSeverity,
    public Line?: number
  ) {}

  output(): string {
    return `"[${this.TypeId}] ${this.Message}" on ${this.FilePath}${
      this.Line ? `(${this.Line},${this.Column})` : ''
    }`
  }
}

export type GitHubSeverity = 'notice' | 'warning' | 'error'
export type ReSharperSeverity =
  | 'INFO'
  | 'HINT'
  | 'SUGGESTION'
  | 'WARNING'
  | 'ERROR'

export type IssueTypes = {
  [Id: string]: GitHubSeverity
}

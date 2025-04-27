import {describe, test} from 'node:test'
import assert from 'assert/strict'
import path from 'path'
import {XmlReport} from '../src/report/xml'
import {SarifReport} from '../src/report/sarif'
import {Issue, GitHubSeverity} from '../src/issue'
import failureSarifReportIssues from './expected_data/failure_sarif_report_issues.json'
import failureXmlReportIssues from './expected_data/failure_xml_report_issues.json'
import {assertIncludeSameMembers} from './utils/assertions'

describe('XML format report', () => {
  test('success report has no issue', () => {
    const report = new XmlReport(
      path.join(
        __dirname,
        '..',
        '__fixtures__',
        'inspection_reports',
        'xml',
        'success.xml'
      ),
      ''
    )
    assert.equal(report.issues.length, 0)
  })

  test('failure report has issues', () => {
    const report = new XmlReport(
      path.join(
        __dirname,
        '..',
        '__fixtures__',
        'inspection_reports',
        'xml',
        'failure.xml'
      ),
      ''
    )
    
    const issueProperties = report.issues.map(issue => ({
      TypeId: issue.TypeId,
      FilePath: issue.FilePath,
      Column: issue.Column,
      Message: issue.Message,
      Severity: issue.Severity as GitHubSeverity,
      Line: issue.Line
    }))
    
    const expectedIssueProperties = failureXmlReportIssues.map(issue => ({
      TypeId: issue.TypeId,
      FilePath: issue.FilePath,
      Column: issue.Column,
      Message: issue.Message,
      Severity: issue.Severity as GitHubSeverity,
      Line: issue.Line
    }))
    
    assertIncludeSameMembers(issueProperties, expectedIssueProperties)
  })

  describe('minimum severity', () => {
    const testCases = [
      {minimumSeverity: 'notice', expected: true},
      {minimumSeverity: 'warning', expected: true},
      {minimumSeverity: 'error', expected: false}
    ]

    for (const {minimumSeverity, expected} of testCases) {
      test(`with minimum severity ${minimumSeverity}`, () => {
        const issues = [
          new Issue('', '', 0, '', 'notice'),
          new Issue('', '', 0, '', 'warning')
        ]
        const report = new XmlReport(
          path.join(
            __dirname,
            '..',
            '__fixtures__',
            'inspection_reports',
            'xml',
            'failure.xml'
          ),
          ''
        )
        report.issues = issues
        assert.equal(report.issueOverThresholdIsExists(minimumSeverity), expected)
      })
    }
  })

  test('ignore issue type', () => {
    const report = new XmlReport(
      path.join(
        __dirname,
        '..',
        '__fixtures__',
        'inspection_reports',
        'xml',
        'failure.xml'
      ),
      'UnusedMember.Global,UnusedField.Compiler'
    )
    assert.equal(report.issues.length, 27)
  })
})

describe('SARIF format report', () => {
  test('success report has no issue', () => {
    const report = new SarifReport(
      path.join(
        __dirname,
        '..',
        '__fixtures__',
        'inspection_reports',
        'sarif',
        'success.json'
      ),
      ''
    )
    assert.equal(report.issues.length, 0)
  })

  test('failure report has issues', () => {
    const report = new SarifReport(
      path.join(
        __dirname,
        '..',
        '__fixtures__',
        'inspection_reports',
        'sarif',
        'failure.json'
      ),
      ''
    )
    
    const issueProperties = report.issues.map(issue => ({
      TypeId: issue.TypeId,
      FilePath: issue.FilePath,
      Column: issue.Column,
      Message: issue.Message,
      Severity: issue.Severity as GitHubSeverity,
      Line: issue.Line
    }))
    
    const expectedIssueProperties = failureSarifReportIssues.map(issue => ({
      TypeId: issue.TypeId,
      FilePath: issue.FilePath,
      Column: issue.Column,
      Message: issue.Message,
      Severity: issue.Severity as GitHubSeverity,
      Line: issue.Line
    }))
    
    assertIncludeSameMembers(issueProperties, expectedIssueProperties)
  })

  describe('minimum severity', () => {
    const testCases = [
      {minimumSeverity: 'notice', expected: true},
      {minimumSeverity: 'warning', expected: true},
      {minimumSeverity: 'error', expected: false}
    ]

    for (const {minimumSeverity, expected} of testCases) {
      test(`with minimum severity ${minimumSeverity}`, () => {
        const issues = [
          new Issue('', '', 0, '', 'notice'),
          new Issue('', '', 0, '', 'warning')
        ]
        const report = new SarifReport(
          path.join(
            __dirname,
            '..',
            '__fixtures__',
            'inspection_reports',
            'sarif',
            'failure.json'
          ),
          ''
        )
        report.issues = issues
        assert.equal(report.issueOverThresholdIsExists(minimumSeverity), expected)
      })
    }
  })

  test('ignore issue type', () => {
    const report = new SarifReport(
      path.join(
        __dirname,
        '..',
        '__fixtures__',
        'inspection_reports',
        'sarif',
        'failure.json'
      ),
      'UnusedParameter.Local'
    )
    assert.equal(report.issues.length, 6)
  })
})
import {XmlReport} from '../src/report/xml'
import {SarifReport} from '../src/report/sarif'
import path from 'path'
import failureSarifReportIssues from './expected_data/failure_sarif_report_issues.json'
import failureXmlReportIssues from './expected_data/failure_xml_report_issues.json'
import {Issue} from '../src/issue'

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
    expect(report.issues.length).toBe(0)
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
    expect(report.issues).toIncludeSameMembers(failureXmlReportIssues)
  })

  test.each([
    {minimumSeverity: 'notice', expected: true},
    {minimumSeverity: 'warning', expected: true},
    {minimumSeverity: 'error', expected: false}
  ])('minimum severity', ({minimumSeverity: minimumSeverity, expected}) => {
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
    expect(report.issueOverThresholdIsExists(minimumSeverity)).toBe(expected)
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
    expect(report.issues.length).toBe(27)
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
    expect(report.issues.length).toBe(0)
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
    expect(report.issues).toIncludeSameMembers(failureSarifReportIssues)
  })

  test.each([
    {minimumSeverity: 'notice', expected: true},
    {minimumSeverity: 'warning', expected: true},
    {minimumSeverity: 'error', expected: false}
  ])('minimum severity', ({minimumSeverity: minimumSeverity, expected}) => {
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
    expect(report.issueOverThresholdIsExists(minimumSeverity)).toBe(expected)
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
    expect(report.issues.length).toBe(6)
  })
})

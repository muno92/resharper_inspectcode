import {XmlReport} from '../src/report/xml'
import path from 'path'
import failureReportIssues from './expected_data/failure_report_issues.json'
import {Issue} from '../src/issue'

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
  expect(report.issues).toIncludeSameMembers(failureReportIssues)
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

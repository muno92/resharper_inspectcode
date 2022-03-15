import {Report} from '../src/report'
import path from 'path'
import failureReportIssues from './expected_data/failure_report_issues.json'
import {Issue} from '../src/issue'

test('success report has no issue', () => {
<<<<<<< HEAD
  const report = new Report(
    path.join(
      __dirname,
      '..',
      '__fixtures__',
      'inspection_reports',
      'success.xml'
    )
  )
  expect(report.issues.length).toBe(0)
})
=======
  const report = new Report(path.join(__dirname, '..', '__fixtures__', 'inspection_reports', 'success.xml'), '')
  expect(report.issues.length).toBe(0)
})

test('failure report has issues', () => {
  const report = new Report(path.join(__dirname, '..', '__fixtures__', 'inspection_reports', 'failure.xml'), '')
  expect(report.issues).toIncludeSameMembers(failureReportIssues)
})

test.each([
  {minimumSeverity: 'notice', expected: true},
  {minimumSeverity: 'warning', expected: true},
  {minimumSeverity: 'error', expected: false},
])('minimum severity', ({minimumSeverity: minimumSeverity, expected}) => {
  const issues = [
    new Issue('', '', 0, '', 'notice'),
    new Issue('', '', 0, '', 'warning'),
  ]
  const report = new Report(path.join(__dirname, '..', '__fixtures__', 'inspection_reports', 'failure.xml'), '')
  report.issues = issues
  expect(report.issueOverThresholdIsExists(minimumSeverity)).toBe(expected)
})

test('ignore issue type', () => {
  const report = new Report(path.join(__dirname, '..', '__fixtures__', 'inspection_reports', 'failure.xml'), 'UnusedMember.Global,UnusedField.Compiler')
  expect(report.issues.length).toBe(27)
})
>>>>>>> 537ae9d37a0dc8943e57058308b5a75bbb873101

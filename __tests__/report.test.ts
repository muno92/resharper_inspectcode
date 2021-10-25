import {Report} from '../src/report'
import path from 'path'
import failureReportIssues from './expected_data/failure_report_issues.json'

test('success report has no issue', () => {
  const report = new Report(path.join(__dirname, '..', '__fixtures__', 'inspection_reports', 'success.xml'))
  expect(report.issues.length).toBe(0)
})

test('failure report has issues', () => {
  const report = new Report(path.join(__dirname, '..', '__fixtures__', 'inspection_reports', 'failure.xml'))
  expect(report.issues).toIncludeSameMembers(failureReportIssues)
})

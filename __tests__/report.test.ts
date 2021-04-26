import {Report} from '../src/report'
import path from 'path'

test('success report has no issue', () => {
  const report = new Report(path.join(__dirname, '__test__', 'inspection_reports', 'success.xml'))
  expect(report.issues.length).toBe(0)
})

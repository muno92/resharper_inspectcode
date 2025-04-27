import {it} from 'node:test'
import assert from 'node:assert'
import {Issue} from '../src/issue'

it('output message with line and column number', () => {
  const issue = new Issue(
    'RedundantUsingDirective',
    '/home/runner/work/ReShaperInspectionInCI/ReShaperInspectionInCI/ReShaperInspectionInCI/Controllers/WeatherForecastController.cs',
    67,
    'Using directive is not required by the code and can be safely removed',
    'warning',
    4
  )

  assert.strictEqual(
    issue.output(),
    '"[RedundantUsingDirective] Using directive is not required by the code and can be safely removed" on /home/runner/work/ReShaperInspectionInCI/ReShaperInspectionInCI/ReShaperInspectionInCI/Controllers/WeatherForecastController.cs(4,67)'
  )
})

it('output message without line and column number', () => {
  const issue = new Issue(
    'RedundantUsingDirective',
    '/home/runner/work/ReShaperInspectionInCI/ReShaperInspectionInCI/ReShaperInspectionInCI/Program.cs',
    0,
    'Using directive is not required by the code and can be safely removed',
    'warning'
  )

  assert.strictEqual(
    issue.output(),
    '"[RedundantUsingDirective] Using directive is not required by the code and can be safely removed" on /home/runner/work/ReShaperInspectionInCI/ReShaperInspectionInCI/ReShaperInspectionInCI/Program.cs'
  )
})

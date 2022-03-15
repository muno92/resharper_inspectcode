import {Issue} from '../src/issue'

test('output message with line and column number', () => {
  const issue = new Issue(
    'RedundantUsingDirective',
    '/home/runner/work/ReShaperInspectionInCI/ReShaperInspectionInCI/ReShaperInspectionInCI/Controllers/WeatherForecastController.cs',
    67,
    'Using directive is not required by the code and can be safely removed',
    'warning',
    4
  )

<<<<<<< HEAD
  expect(issue.output()).toBe(
    '"Using directive is not required by the code and can be safely removed" on /home/runner/work/ReShaperInspectionInCI/ReShaperInspectionInCI/ReShaperInspectionInCI/Controllers/WeatherForecastController.cs(4,67)'
  )
=======
  expect(issue.output()).toBe('"[RedundantUsingDirective] Using directive is not required by the code and can be safely removed" on /home/runner/work/ReShaperInspectionInCI/ReShaperInspectionInCI/ReShaperInspectionInCI/Controllers/WeatherForecastController.cs(4,67)')
>>>>>>> 537ae9d37a0dc8943e57058308b5a75bbb873101
})

test('output message without line and column number', () => {
  const issue = new Issue(
    'RedundantUsingDirective',
    '/home/runner/work/ReShaperInspectionInCI/ReShaperInspectionInCI/ReShaperInspectionInCI/Program.cs',
    0,
    'Using directive is not required by the code and can be safely removed',
    'warning'
  )

<<<<<<< HEAD
  expect(issue.output()).toBe(
    '"Using directive is not required by the code and can be safely removed" on /home/runner/work/ReShaperInspectionInCI/ReShaperInspectionInCI/ReShaperInspectionInCI/Program.cs'
  )
=======
  expect(issue.output()).toBe('"[RedundantUsingDirective] Using directive is not required by the code and can be safely removed" on /home/runner/work/ReShaperInspectionInCI/ReShaperInspectionInCI/ReShaperInspectionInCI/Program.cs')
>>>>>>> 537ae9d37a0dc8943e57058308b5a75bbb873101
})

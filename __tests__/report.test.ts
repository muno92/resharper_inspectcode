import {describe as testDescribe, it} from 'node:test'
import assert from 'node:assert'
import {XmlReport} from '../src/report/xml'
import {SarifReport} from '../src/report/sarif'
import path from 'path'
import failureSarifReportIssues from './expected_data/failure_sarif_report_issues.json'
import failureXmlReportIssues from './expected_data/failure_xml_report_issues.json'
import {Issue} from '../src/issue'
import {describe, assertIncludesSameMembers} from './test-utils'

describe('XML format report', () => {
  testDescribe('XML report tests', () => {
    it('success report has no issue', () => {
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
      assert.strictEqual(report.issues.length, 0)
    })

    it('failure report has issues', () => {
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
      assertIncludesSameMembers(report.issues, failureXmlReportIssues)
    })

    it('minimum severity - notice', () => {
      testMinimumSeverity('notice', true, 'xml')
    })

    it('minimum severity - warning', () => {
      testMinimumSeverity('warning', true, 'xml')
    })

    it('minimum severity - error', () => {
      testMinimumSeverity('error', false, 'xml')
    })

    it('ignore issue type', () => {
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
      assert.strictEqual(report.issues.length, 27)
    })
  })
})

describe('SARIF format report', () => {
  testDescribe('SARIF report tests', () => {
    it('success report has no issue', () => {
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
      assert.strictEqual(report.issues.length, 0)
    })

    it('failure report has issues', () => {
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
      assertIncludesSameMembers(report.issues, failureSarifReportIssues)
    })

    it('minimum severity - notice', () => {
      testMinimumSeverity('notice', true, 'sarif')
    })

    it('minimum severity - warning', () => {
      testMinimumSeverity('warning', true, 'sarif')
    })

    it('minimum severity - error', () => {
      testMinimumSeverity('error', false, 'sarif')
    })

    it('ignore issue type', () => {
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
      assert.strictEqual(report.issues.length, 6)
    })
  })
})

// Helper function for testing minimum severity
function testMinimumSeverity(
  minimumSeverity: string,
  expected: boolean,
  format: 'xml' | 'sarif'
): void {
  const issues = [
    new Issue('', '', 0, '', 'notice'),
    new Issue('', '', 0, '', 'warning')
  ]

  const reportPath =
    format === 'xml'
      ? path.join(
          __dirname,
          '..',
          '__fixtures__',
          'inspection_reports',
          'xml',
          'failure.xml'
        )
      : path.join(
          __dirname,
          '..',
          '__fixtures__',
          'inspection_reports',
          'sarif',
          'failure.json'
        )

  const report =
    format === 'xml'
      ? new XmlReport(reportPath, '')
      : new SarifReport(reportPath, '')

  report.issues = issues
  assert.strictEqual(
    report.issueOverThresholdIsExists(minimumSeverity),
    expected
  )
}

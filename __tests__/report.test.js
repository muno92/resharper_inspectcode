const {describe, it} = require('node:test')
const assert = require('node:assert')
const {XmlReport} = require('../lib/report/xml')
const {SarifReport} = require('../lib/report/sarif')
const path = require('path')
const failureSarifReportIssues = require('./expected_data/failure_sarif_report_issues.json')
const failureXmlReportIssues = require('./expected_data/failure_xml_report_issues.json')
const {Issue} = require('../lib/issue')
const {assertIncludesSameMembers} = require('./test-utils')

describe('XML format report', () => {
  describe('XML report tests', () => {
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
  describe('SARIF report tests', () => {
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
  minimumSeverity,
  expected,
  format
) {
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

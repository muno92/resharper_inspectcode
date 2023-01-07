[![build-test](https://github.com/muno92/resharper_inspectcode/actions/workflows/test.yml/badge.svg)](https://github.com/muno92/resharper_inspectcode/actions/workflows/test.yml)

# ReSharper CLI InspectCode

This action inspect code with ReSharper Command Line Tool.

Inspection result is annotate to PR File Change Tab.

![Annotation](annotation.png)

## Input

### solutionPath

**Required**

Path to Solution file to be inspected.

### failOnIssue

Whether the action should fail if there are any issues. Default is `'1'`.

Set this option to `'0'` prevent the action from failing when issues exist (annotations will still be present).

### version

Version of the Resharper CLI tool to install. Defaults to the latest available.

### minimumSeverity

- error
- warning
- notice (default)

Minimum severity for issues to cause the action to fail. Defaults to "notice". Ignored if `failOnIssue` is set to `'0'`.

### exclude

Relative path(s) or file masks that define which files to exclude during the inspection.

More info: https://www.jetbrains.com/help/resharper/InspectCode.html#inspection-parameters

### include

Include one or more paths or file masks; see [the documentation][include-arg]. Specify one path or
pattern per line.

Example:

```yml
- name: Inspect code
  uses: muno92/resharper_inspectcode@1.6.6
  with:
    solutionPath: ./YourSolution.sln
    include: |
      **.cs
      **.cshtml
```

[include-arg]: https://www.jetbrains.com/help/resharper/InspectCode.html#inspection-parameters

### ignoreIssueType

Comma-separated list of issue types to ignore.

Example:

```text
UnusedField.Compiler,UnusedMember.Global
```

Issue Types reference: https://www.jetbrains.com/help/resharper/Reference__Code_Inspections_CSHARP.html

### solutionWideAnalysis

- true
- false

Explicitly enable or disable solution-wide analysis. If not specified, solution-wide analysis will
be enabled or disabled based on the existing settings.

### workingDirectory

The directory to run the command in. All paths (solution path, include/exclude patterns, etc) are
also relative to this directory.

## Usage

```yaml
on: [push]

jobs:
  inspection:
    runs-on: ubuntu-latest # or macos-latest, windows-latest
    name: Inspection
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '7.0.x' # [3.1.x, 5.0.x, 6.0.x, 7.0.x]
      - name: Restore
        run: dotnet restore
      - name: Inspect code
        uses: muno92/resharper_inspectcode@1.6.5
        with:
          solutionPath: ./YourSolution.sln
```

[![build-test](https://github.com/muno92/resharper_inspectcode/actions/workflows/test.yml/badge.svg)](https://github.com/muno92/resharper_inspectcode/actions/workflows/test.yml)

# ReSharper CLI InspectCode

This action inspect code with ReSharper Command Line Tool.

Inspection result is annotate to PR File Change Tab.

![Annotation](annotation.png)

## Input

### solutionPath

**Required**

Inspection Target Solution File Path

### failOnIssue

Default is '1'.

Set this option '0', only annotation is enabled, action will not fail when issue is exists.

### version

Default is '2021.1.5'.

Set this option to change the version of the ReSharper CLI that's installed.

### minimumSeverity

- error
- warning
- notice (default)

If set this option 'warning', action will fail when error or warning issue is exists.
(Notice issue is annotated only.)

### exclude

Set this options to specified exclude path to ReSharper CLI.

(See [https://www.jetbrains.com/help/resharper/InspectCode.html#inspection-parameters](https://www.jetbrains.com/help/resharper/InspectCode.html#inspection-parameters))

### ignoreIssueType

Comma-separated list of ignore issue type.

example) 

```text
UnusedField.Compiler,UnusedMember.Global
```

References:  
[https://www.jetbrains.com/help/resharper/Reference__Code_Inspections_CSHARP.html#BestPractice](https://www.jetbrains.com/help/resharper/Reference__Code_Inspections_CSHARP.html#BestPractice)

## Usage

```yaml
on: [push]

jobs:
  inspection:
    runs-on: ubuntu-latest # or macos-latest, windows-latest
    name: Inspection
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Setup .NET
        uses: actions/setup-dotnet@v1
        with:
          dotnet-version: '6.0.x' # or 3.1.x, 5.0.x
      - name: Restore
        run: dotnet restore
      - name: Inspect code
        uses: muno92/resharper_inspectcode@1.5.0
        with:
          solutionPath: ./YourSolution.sln
```

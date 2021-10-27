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

Set this option '0', only annotation is enabled, action will not failed when issue is exists.

### version

Default is '2021.1.5'.

Set this option to change the version of the Resharper CLI that's installed.

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
          dotnet-version: '5.0.x' # or 3.1.x
      - name: Restore
        run: dotnet restore
      - name: Inspect code
        uses: muno92/resharper_inspectcode@1.2.0
        with:
          solutionPath: ./YourSolution.sln
```

## Update ReSharper version

1. In `src/installer.ts`, change the version number in line 6 to the required version.
2. Run `npm run-script all`.
3. commit & push.
4. Create new tag for this repository.
5. In the repositories that uses this action, change the tag in the workflow to the new tag.

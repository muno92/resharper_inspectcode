import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'

export class Installer {
  //TODO check dotnet sdk in constructor
  async install(version: string): Promise<number> {
    // If JetBrains.ReSharper.GlobalTools is already installed, skip installation to avoid install error.
    try {
      await io.which('jb', true)
      core.info(
        'JetBrains.ReSharper.GlobalTools is already installed, so skip installation.'
      )
      return 0
    } catch (Error) {
      core.info('Install JetBrains.ReSharper.GlobalTools.')
    }

    return exec.exec(
      `dotnet tool install -g JetBrains.ReSharper.GlobalTools --version ${version}`
    )
  }
}

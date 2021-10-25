import * as exec from '@actions/exec'

export class Installer {
  //TODO check dotnet sdk in constructor
  async install(version: string): Promise<number> {
    return exec.exec(
      `dotnet tool install -g JetBrains.ReSharper.GlobalTools --version ${version}`
    )
  }
}

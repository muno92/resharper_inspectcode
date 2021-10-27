import * as exec from '@actions/exec'

export class Installer {
  //TODO check dotnet sdk in constructor
  async install(): Promise<number> {
    return exec.exec(
      'dotnet tool install -g JetBrains.ReSharper.GlobalTools --version 2021.2.2'
    )
  }
}

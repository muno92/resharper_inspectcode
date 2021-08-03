import * as exec from '@actions/exec'

export class Installer {
  //TODO check dotnet sdk in constructor
  async install(): Promise<number> {
    //ver 2021.2 depends on .NET 5
    return exec.exec(
      'dotnet tool install -g JetBrains.ReSharper.GlobalTools --version 2021.1.5'
    )
  }
}

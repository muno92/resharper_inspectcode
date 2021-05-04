import * as exec from '@actions/exec'

export class Installer {
  //TODO check dotnet sdk in constructor
  install(): void {
    exec.exec('dotnet add package JetBrains.ReSharper.CommandLineTools')
  }
}

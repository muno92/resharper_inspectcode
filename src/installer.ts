import * as exec from '@actions/exec'

export class Installer {
  //TODO check dotnet sdk in constructor
  async install(version: string): Promise<number> {
    let command = `dotnet tool update --global JetBrains.ReSharper.GlobalTools`

    if (version !== '') {
      command += ` --version ${version}`
    }

    return exec.exec(command)
  }
}

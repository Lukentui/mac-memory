import { exec } from "child_process";

const PAGE_SIZE = 4096

const executeCommand = async (command: string): Promise<string> => {
  return new Promise((resolve) => {
    exec(command, (_, stdout) => {
      return resolve(stdout)
    })
  })
}

const physicalMemory = async (): Promise<number> => {
  const commandResponse = await executeCommand('sysctl -n hw.memsize')
  return Number(String(commandResponse))
}

const fetchVmStats = async (): Promise<Record<string, number>> => {
  const commandResponse = (await executeCommand('vm_stat'))
    .split('\n').filter((x, i) => x !== '' && i > 0)

  return commandResponse.map(v => v.split(':').map(v => v.trim().replace('.', ''))).reduce((prev, curr) => ({
    ...prev,
    [curr[0]]: Number(curr[1]),
  }), {})
}

const currentUsedMemory = async (): Promise<number> => {
  const vmStats = await fetchVmStats();
  const usedMemoryPages = (
    vmStats['Anonymous pages']-vmStats['Pages purgeable']
  ) + vmStats['Pages wired down'] + vmStats['Pages occupied by compressor']

  return usedMemoryPages*PAGE_SIZE
}

export default async () => {
  const total = await physicalMemory();
  const used = await currentUsedMemory();

  return {
    usedPercent: used/total*100,
    used,
    total,
  }
}

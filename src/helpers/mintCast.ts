import { ContractReceipt } from 'ethers'
import { v4 as uuidv4 } from 'uuid'
import castsContract from './castsContract'

const callbacks = {} as {
  [uuid: string]: (
    value:
      | ContractReceipt
      | PromiseLike<ContractReceipt | undefined>
      | undefined
  ) => void
}

const jobs = [] as { uuid: string; parentHash: string; address: string }[]

let working = false
setInterval(async () => {
  if (working) {
    return
  }
  working = true
  const nextJob = jobs.shift()
  try {
    if (!nextJob) {
      return
    }
    let owner
    try {
      owner = await castsContract.ownerOf(nextJob.parentHash)
    } catch {
      // do nothing
    }
    if (owner) {
      callbacks[nextJob.uuid]?.(undefined)
      return
    }
    const tx = await (
      await castsContract.mint(nextJob.parentHash, nextJob.address)
    ).wait()
    callbacks[nextJob.uuid]?.(tx)
    delete callbacks[nextJob.uuid]
  } catch (error) {
    if (nextJob) {
      console.error(error instanceof Error ? error.message : error)
      callbacks[nextJob.uuid]?.(undefined)
      delete callbacks[nextJob.uuid]
    }
  } finally {
    working = false
  }
}, 1000)

export default function (parentHash: string, address: string) {
  return new Promise<ContractReceipt | undefined>((resolve) => {
    const uuid = uuidv4()
    callbacks[uuid] = resolve
    jobs.push({ uuid, parentHash, address })
  })
}

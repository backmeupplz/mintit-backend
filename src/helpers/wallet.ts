import { Wallet } from 'ethers'
import env from './env'
import provider from './provider'

export default Wallet.fromMnemonic(env.FARCASTER_MNEMONIC).connect(provider)

import { providers } from 'ethers'
import env from './env'

export default new providers.JsonRpcProvider(env.ETH_RPC)

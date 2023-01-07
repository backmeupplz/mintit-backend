import { Casts__factory } from 'mintit-contract'
import env from './env'
import wallet from './wallet'

export default Casts__factory.connect(env.CONTRACT_ADDRESS, wallet)

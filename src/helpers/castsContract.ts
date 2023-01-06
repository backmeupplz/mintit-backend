import { Casts__factory } from 'mintit-contract'
import env from '@/helpers/env'
import provider from '@/helpers/provider'

export default Casts__factory.connect(env.CONTRACT_ADDRESS, provider)

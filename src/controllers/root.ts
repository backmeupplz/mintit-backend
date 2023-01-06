import { Body, Controller, Get } from 'amala'
import TokenId from '@/validators/TokenId'

@Controller('/')
export default class RootController {
  @Get('/metadata')
  metadata(@Body({ required: true }) { tokenId }: TokenId) {
    return { success: true, tokenId }
  }

  @Get('/image')
  image(@Body({ required: true }) { tokenId }: TokenId) {
    return { success: true, tokenId }
  }
}

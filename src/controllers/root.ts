import { BigNumber } from 'ethers'
import { Context } from 'koa'
import { Controller, Ctx, Get, Params } from 'amala'
import { notFound } from '@hapi/boom'
import TokenId from '../validators/TokenId'
import castsContract from '../helpers/castsContract'
import merkleClient from '../helpers/merkleClient'
import textToImage from '../helpers/textToImage'

@Controller('/')
export default class RootController {
  @Get('/metadata/:tokenId')
  async metadata(@Params() { tokenId }: TokenId, @Ctx() ctx: Context) {
    try {
      const owner = await castsContract.ownerOf(tokenId)
      if (!owner) {
        throw new Error()
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : error)
      return ctx.throw(notFound("Cast isn't minted yet"))
    }
    const cast = await merkleClient.fetchCast(
      BigNumber.from(tokenId).toHexString()
    )
    if (!cast) {
      return ctx.throw(notFound('Cast not found'))
    }
    return {
      description: `@${cast.author.username || cast.author.fid}:\n${cast.text}`,
      external_url: 'https://farcaster.xyz',
      image: `https://mintit.boats/image/${tokenId}`,
      name: `Cast ${tokenId}`,
    }
  }

  @Get('/image/:tokenId')
  async image(@Params() { tokenId }: TokenId, @Ctx() ctx: Context) {
    try {
      const owner = await castsContract.ownerOf(tokenId)
      if (!owner) {
        throw new Error()
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : error)
      return ctx.throw(notFound("Cast isn't minted yet"))
    }
    const cast = await merkleClient.fetchCast(
      BigNumber.from(tokenId).toHexString()
    )
    if (!cast) {
      return ctx.throw(notFound('Cast not found'))
    }
    return textToImage(cast.text, cast.author.username || cast.author.fid)
  }
}

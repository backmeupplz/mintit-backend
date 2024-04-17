import { CastWithInteractions } from '../../node_modules/@standard-crypto/farcaster-js-neynar/dist/commonjs/v1/openapi/generated/models/cast-with-interactions'
import { SeenCastModel } from '../models/SeenCast'
import castsContract from './castsContract'
import dateStringToTimestamp from './dateStringToTimestamp'
import mintCast from './mintCast'
import publishCast from './publishCast'

export default async function (notification: CastWithInteractions) {
  console.log('got notification', notification)
  try {
    // Check if mention
    if (notification.type !== 'cast-mention') {
      return
    }
    if (!('username' in notification.author)) {
      return
    }
    // Check if it's a self-notification
    if (notification.author.username.toLowerCase() === 'mintit') {
      return
    }
    // Check if it has text
    const mentionText = notification.text
    if (!mentionText) {
      return
    }
    // Check if it has a hash
    if (!notification.hash) {
      return
    }
    // Check if we've seen this notification
    const dbCast = await SeenCastModel.findOne({
      hash: notification.hash,
    })
    if (dbCast) {
      return
    }
    if (
      dateStringToTimestamp(notification.timestamp) <
      Date.now() - 1000 * 60 * 15
    ) {
      return
    }
    await SeenCastModel.create({
      hash: notification.hash,
    })
    // Check if it is a reply
    if (!notification.parentHash) {
      await publishCast(
        '👋 Thank you for the mention!\n\nTo mint any cast as an NFT, reply to it with the word "@mintit" 🚀',
        notification.hash
      )
      return
    }
    // Check if we already minted this cast
    let owner: string | undefined
    try {
      owner = await castsContract.ownerOf(notification.parentHash)
    } catch (error) {
      // do nothing
    }
    if (owner) {
      await publishCast(
        `😅 So sorry, this cast is already owned by ${owner}!`,
        notification.hash
      )
      return
    }
    // Mint the cast
    const address = notification.author.verifications[0]
    if (!address) {
      await publishCast(
        `🤔 I couldn't fetch the address connected to your Farcaster account, sorry!`,
        notification.hash
      )
      return
    }
    const tx = await mintCast(notification.parentHash, address)
    if (!tx) {
      await publishCast(
        '🤔 I could not mint this cast, sorry! Is it already minted by somebody else?',
        notification.hash
      )
      return
    }
    return publishCast(
      `🚀 The cast has been minted as an NFT! You can check the transaction here: https://explorer.zora.energy/tx/${tx.transactionHash}`,
      notification.hash
    )
  } catch (error) {
    console.log(error instanceof Error ? error.message : error)
    if (notification.hash) {
      await publishCast(
        "@borodutch something went wrong here, I'm so sorry",
        notification.hash
      )
    }
  }
}

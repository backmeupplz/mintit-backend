import { Notification } from '@big-whale-labs/botcaster'
import { SeenCastModel } from '../models/SeenCast'
import castsContract from './castsContract'
import merkleClient from './merkleClient'
import mintCast from './mintCast'
import publishCast from './publishCast'

export default async function (notification: Notification) {
  try {
    // Check if mention
    if (notification.type !== 'cast-mention') {
      return
    }
    // Check if it has text
    const mentionText = notification.content.cast?.text
    if (!mentionText) {
      return
    }
    // Check if it has a hash
    if (!notification.content.cast?.hash) {
      return
    }
    // Check if there is an actor
    if (!notification.actor) {
      return
    }
    // Check if we've seen this notification
    const dbCast = await SeenCastModel.findOne({
      hash: notification.content.cast.hash,
    })
    if (dbCast) {
      return
    }
    await SeenCastModel.create({
      hash: notification.content.cast.hash,
    })
    // Check if it is a reply
    if (!notification.content.cast?.parentHash) {
      await publishCast(
        '👋 Thank you for the mention!\n\nTo mint any cast as an NFT, reply to it with the word "@mintit" 🚀',
        notification.content.cast.hash
      )
      return
    }
    // Check if we already minted this cast
    let owner: string | undefined
    try {
      owner = await castsContract.ownerOf(notification.content.cast.parentHash)
    } catch (error) {
      // do nothing
    }
    if (owner) {
      await publishCast(
        `😅 So sorry, this cast is already owned by ${owner}!`,
        notification.content.cast.hash
      )
      return
    }
    // Mint the cast
    const verifications = await merkleClient.fetchUserVerifications(
      notification.actor as { fid: number }
    )
    const verification = await verifications.next()
    const v = verification.value
    const address = v?.address
    if (!address) {
      await publishCast(
        `🤔 I couldn't fetch the address connected to your Farcaster account, sorry!`,
        notification.content.cast.hash
      )
      return
    }
    const tx = await mintCast(notification.content.cast.parentHash, address)
    if (!tx) {
      await publishCast(
        '🤔 I could not mint this cast, sorry! Is it already minted by somebody else?',
        notification.content.cast.hash
      )
      return
    }
    return publishCast(
      `🚀 The cast has been minted as an NFT! You can check the transaction here: https://polygonscan.com/tx/${tx.transactionHash}`,
      notification.content.cast.hash
    )
  } catch (error) {
    console.log(error instanceof Error ? error.message : error)
    if (notification.content.cast?.hash) {
      await publishCast(
        "@borodutch something went wrong here, I'm so sorry",
        notification.content.cast.hash
      )
    }
  }
}
